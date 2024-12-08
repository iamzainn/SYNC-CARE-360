// components/patient/dashboard/sections/ChatWindow.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Check, CheckCheck, Verified } from "lucide-react"
import { pusherClient } from "@/lib/pusher"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  senderId: string
  senderRole: 'DOCTOR' | 'PATIENT'
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
  createdAt: string
}

interface ChatWindowProps {
  booking: any
  patientId: string
  onClose: () => void
}

export function ChatWindow({ booking, patientId, onClose }: ChatWindowProps) {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [conversationId, setConversationId] = useState<string>()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Create or get conversation
        const conversationRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: booking.doctor.id,
            patientId,
            homeServiceBookingId: booking.id
          })
        })
        
        const conversation = await conversationRes.json()
        setConversationId(conversation.id)

        // Load existing messages
        const messagesRes = await fetch(`/api/chat/conversations/${conversation.id}`)
        const existingMessages = await messagesRes.json()
        setMessages(existingMessages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing chat:", error)
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [booking, patientId])

  // Subscribe to Pusher channels
  useEffect(() => {
    if (!conversationId) return

    const channel = pusherClient.subscribe(`chat_${conversationId}`)

    channel.bind('new-message', (newMessage: Message) => {
      setMessages(current => [...current, newMessage])
      
      // Mark message as read if we're the recipient
      if (newMessage.senderId !== session?.user?.id) {
        fetch(`/api/chat/messages/${newMessage.id}/read`, { method: 'POST' })
      }
    })

    channel.bind('typing-indicator', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== session?.user?.id) {
        setIsTyping(data.isTyping)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        if (data.isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false)
          }, 3000)
        }
      }
    })

    return () => {
      pusherClient.unsubscribe(`chat_${conversationId}`)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [conversationId, session?.user?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !conversationId) return

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: message
        })
      })

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleTyping = async () => {
    if (!conversationId) return

    try {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          isTyping: true
        })
      })
    } catch (error) {
      console.error("Error updating typing status:", error)
    }
  }

  if (isLoading) {
    return <div>Loading chat...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Dr. {booking.doctor.name}</h3>
            {booking.doctor.isVerifiedDoctor && (
              <Verified className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {booking.doctor.specialization}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === patientId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[80%]">
              <div
                className={`rounded-lg px-4 py-2 ${
                  msg.senderId === patientId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
              {msg.senderId === patientId && (
                <div className="flex justify-end items-center mt-1">
                  {msg.status === 'SENT' && <Check className="h-3 w-3 text-muted-foreground" />}
                  {msg.status === 'DELIVERED' && <CheckCheck className="h-3 w-3 text-muted-foreground" />}
                  {msg.status === 'READ' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-muted-foreground">
            Dr. {booking.doctor.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
        <Input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            handleTyping()
          }}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}