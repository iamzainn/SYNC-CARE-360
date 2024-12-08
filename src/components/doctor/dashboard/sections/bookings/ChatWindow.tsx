"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Check, CheckCheck } from "lucide-react"
import { pusherClient } from "@/lib/pusher"
import { useSession } from "next-auth/react"
import { debounce } from "lodash"

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
  doctorId: string
  onClose: () => void
}

export function ChatWindow({ booking, doctorId, onClose }: ChatWindowProps) {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Create or get conversation
        const conversationRes = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId,
            patientId: booking.patientId, // Make sure this matches your booking structure
            ...(booking.id && { homeServiceBookingId: booking.id }) // Use the correct booking ID field
          })
        })
        
        if (!conversationRes.ok) {
          throw new Error("Failed to create conversation")
        }
    
        const conversation = await conversationRes.json()
        setConversationId(conversation.id)
    
        // Load existing messages
        const messagesRes = await fetch(`/api/chat/conversations/${conversation.id}`)
        if (!messagesRes.ok) {
          throw new Error("Failed to load messages")
        }
    
        const existingMessages = await messagesRes.json()
        setMessages(existingMessages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing chat:", error)
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [booking, doctorId])

  useEffect(() => {
    console.log("Booking data:", booking)
  }, [booking])

 

  // Subscribe to Pusher channels
  useEffect(() => {
    if (!conversationId || !session?.user) return

  const channel = pusherClient.subscribe(`chat_${conversationId}`)

  channel.bind('new-message', (newMessage: Message) => {
    setMessages(current => [...current, newMessage])
    
    // Mark message as read if we're the recipient
    if (newMessage.senderId !== session.user.id) {
      markMessageAsRead(newMessage.id)
    }
  })

    channel.bind('typing-indicator', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== session?.user?.id) {
        setIsTyping(data.isTyping)
      }
    })

    return () => {
      pusherClient.unsubscribe(`chat_${conversationId}`)
    }
  }, [conversationId, session?.user?.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debounced typing indicator
  const debouncedTyping = debounce(async () => {
    if (!conversationId) return

    await fetch("/api/chat/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        isTyping: true
      })
    })

    setTimeout(async () => {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          isTyping: false
        })
      })
    }, 2000)
  }, 300)


  const markMessageAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/chat/messages/${messageId}/read`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !conversationId) return

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: message
        })
      })

      if (!res.ok) throw new Error("Failed to send message")
      
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    debouncedTyping()
  }

  if (isLoading) {
    return <div>Loading chat...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h3 className="font-semibold">{booking.patient.name}</h3>
          <p className="text-sm text-muted-foreground">
            {booking.patient.email}
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
              msg.senderId === doctorId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[80%]">
              <div
                className={`rounded-lg px-4 py-2 ${
                  msg.senderId === doctorId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
              {msg.senderId === doctorId && (
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
            {booking.patient.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
        <Input
          value={message}
          onChange={handleInputChange}
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