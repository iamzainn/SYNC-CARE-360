"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useLocationStore } from "@/store/useLocationStore";
import { LocationDetectButton } from "./LocationDetectButton";
import { SearchDialog } from "./SearchDialogue";

export const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { location } = useLocationStore();

  return (
    <Card className="w-full max-w-[1280px] mx-auto overflow-hidden rounded-3xl mt-4 shadow-lg">
      <div className="relative w-full bg-gradient-to-r from-[#6B4244] via-[#392B54] to-[#1E1B4B]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[420px]">
          {/* Text and Search Section */}
          <div className="lg:col-span-7 p-8 lg:p-12 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Find and Book the{" "}
              <span className="text-[#39B7FF]">Best Doctors</span>{" "}
              <span className="block lg:inline">near you</span>
            </h1>

            {/* Combined Search Bar */}
            <div className="relative max-w-2xl bg-white rounded-xl shadow-sm">
              {/* Location Section */}
              <div className="absolute left-0 top-0 h-full flex items-center pl-4 pr-2 border-r border-gray-200">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={location || ""}
                  readOnly
                  onClick={() => setIsDialogOpen(true)}
                  className="w-24 sm:w-32 bg-transparent border-0 p-0 focus:ring-0 placeholder:text-gray-400"
                />
                <LocationDetectButton />
              </div>

              {/* Search Input */}
              <div className="flex">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder=""
                    onClick={() => setIsDialogOpen(true)}
                    readOnly
                    className="h-14 pl-[180px] sm:pl-[220px] pr-32 border-0 rounded-xl focus:ring-0"
                  />
                </div>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="absolute right-0 top-0 h-full bg-[#39B7FF] hover:bg-[#2da8f0] text-white px-8 rounded-r-xl text-base font-medium transition-colors min-w-[120px]"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:col-span-5 relative h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#392B54] lg:hidden z-[1]" />
            <img
              src="/Services/d.png"
              alt="Healthcare Professional"
              className="absolute top-[10%] right-0 bottom-0 hidden sm:block sm:h-[170%] w-full lg:w-auto object-cover object-right-bottom"
            />
          </div>
        </div>
      </div>

      <SearchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  );
};

export default HeroSection;
