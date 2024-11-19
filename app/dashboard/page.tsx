"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  CalendarDays,
  RefreshCw,
  User,
  Key,
  Clock,
  LogOut,
  Info,
  MapPin,
  AlertCircle,
  ParkingSquare,
  Bookmark,
  LogOutIcon,
  PhoneCallIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface Slot {
  _id: string;
  slotNumber: string;
  status: string;
  bookedBy?: {
    _id?: string;
    username?: string;
    vehicleNumber?: string;
    mobile?: string;
  };
  bookingStart?: string;
  bookingEnd?: string;
}

export default function DashboardPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetchSlots();
    console.log(selectedSlot);

    // Connect to WebSocket server
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('parkingStatus', (parkingStatus) => {
      console.log('Received parking status:', parkingStatus);
      fetchSlots(); // Update slots when status changes
    });

    socket.on('triggerServo', (status) => {
      console.log('Servo triggered:', status);
      // Handle servo trigger if needed
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setSlots(data.data.slots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch parking slots",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bookSlot = async (slotId: string) => {
    if (!date) return;

    try {
      const [hours, minutes] = startTime.split(":");
      const bookingStart = new Date(date);
      bookingStart.setHours(parseInt(hours), parseInt(minutes), 0);
      const bookingEnd = new Date(bookingStart);
      bookingEnd.setHours(bookingStart.getHours() + parseInt(duration));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/slots/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            slotNumber: slotId,
            bookingStart: bookingStart.toISOString(),
            bookingEnd: bookingEnd.toISOString(),
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Slot booked successfully",
        });
        fetchSlots();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: (
            <>
              {data.message}. Try{" "}
              <Link
                href="#"
                className="underline"
                onClick={() => {
                  const slotToRelease = slots.find(
                    (slot) => slot.bookedBy?._id === user?._id
                  )?.slotNumber;
                  if (slotToRelease) {
                    releaseSlot(slotToRelease);
                  }
                }}
              >
                Release Slot
              </Link>
            </>
          ),
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book slot",
      });
    }
  };

  const releaseSlot = async (slotId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/slots/release`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            slotNumber: slotId,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Slot released successfully",
        });
        fetchSlots();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: (
          <>
            Failed to release slot. Try{" "}
            <Link
              href="#"
              className="underline"
              onClick={() => releaseSlot(slotId)}
            >
              releasing again
            </Link>
          </>
        ),
      });
    }
  };

  const getSlotIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Car className="h-16 w-16 text-green-500 animate-pulse" />;
      case "occupied":
        return <Bookmark className="h-16 w-16 text-blue-500 animate-bounce" />;
      case "parked":
        return (
          <div className="relative w-32 h-32 group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg transform transition-all duration-300 group-hover:shadow-2xl" />
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-2">
                <ParkingSquare className="h-4 w-4" />
                <span className="text-sm font-semibold">Parked</span>
              </div>
            </div>
            <div className="absolute inset-2 flex items-center justify-center">
              <div className="relative">
                <Car className="h-20 w-20 text-blue-600 drop-shadow-lg transform transition-all duration-300 group-hover:scale-105" />
                <div className="absolute -bottom-2 inset-x-0 h-4 bg-black/10 blur-sm rounded-full transform scale-75" />
              </div>
            </div>
            <div className="absolute bottom-3 inset-x-4">
              <div className="flex justify-between gap-2">
                <div className="h-1 w-8 bg-yellow-400 rounded-full shadow-sm" />
                <div className="h-1 w-8 bg-yellow-400 rounded-full shadow-sm" />
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-blue-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-200/50 to-transparent rounded-b-xl" />
          </div>
        );
      default:
        return <Car className="h-16 w-16" />;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your parking reservations and view available slots
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={logout}>
                  <LogOutIcon
                    className={`mr-2 h-4 w-4 text-red-700 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Logout
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout from Smart Parking System</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Vehicle:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  {user?.vehicleNumber}
                </Badge>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Keep your vehicle information up to date for seamless parking
                  management
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CalendarDays className="h-6 w-6" />
                Current Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {slots.find(
                (slot: { bookedBy?: { _id?: string }; slotNumber: string }) =>
                  slot.bookedBy?._id === user?._id
              ) ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Slot Number:</span>
                    <Badge className="animate-pulse">
                      {
                        slots.find(
                          (slot: {
                            bookedBy?: { _id?: string };
                            slotNumber: string;
                          }) => slot.bookedBy?._id === user?._id
                        )?.slotNumber
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      P
                      {
                        slots.find(
                          (slot: {
                            bookedBy?: { _id?: string };
                            slotNumber: string;
                          }) => slot.bookedBy?._id === user?._id
                        )?.slotNumber
                      }
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full hover:bg-red-600 transition-colors"
                    onClick={() => {
                      const slotToRelease = slots.find(
                        (slot: {
                          bookedBy?: { _id?: string };
                          slotNumber: string;
                        }) => slot.bookedBy?._id === user?._id
                      )?.slotNumber;
                      if (slotToRelease) {
                        releaseSlot(slotToRelease);
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Release Slot
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="text-muted-foreground">
                    No active bookings
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Book a parking slot from the available slots below
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Key className="h-8 w-8" />
              Available Parking Slots
            </h2>
            <Badge variant="outline" className="text-sm">
              {
                slots.filter(
                  (slot: { status: string }) => slot.status === "available"
                ).length
              }{" "}
              slots available
            </Badge>
          </div>

          <ScrollArea className="h-[600px] rounded-lg border">
            {
            // isLoading ? (
            //   <div className="flex items-center justify-center h-full p-12">
            //     <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
            //   </div>
            // ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {slots.map((slot: Slot) => (
                  <Card
                    key={slot._id}
                    className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                      slot.status === "available"
                        ? "hover:border-green-500 hover:scale-105"
                        : "hover:scale-102"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-50">
                            {getSlotIcon(slot.status)}
                          </div>
                          <div className="space-y-1">
                            <div className="text-xl font-bold">
                              Slot {slot.slotNumber}
                            </div>
                            <Badge
                              variant={
                                slot.status === "available"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`
                                ${
                                  slot.status === "available"
                                    ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                                    : ""
                                }
                                ${
                                  slot.status === "occupied"
                                    ? "bg-blue-500/10 text-blue-700"
                                    : ""
                                }
                                ${
                                  slot.status === "parked"
                                    ? "bg-blue-500/10 text-blue-700"
                                    : ""
                                }
                                font-medium
                              `}
                            >
                              {slot.status === "occupied"
                                ? "Booked"
                                : slot.status}
                            </Badge>
                          </div>
                        </span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-4">
                      {slot.status === "available" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full  bg-green-600 hover:bg-green-700 transition-colors"
                              variant="default"
                              onClick={() => setSelectedSlot(slot)}
                            >
                              <CalendarDays className="mr-2 h-5 w-5" />
                              Book Slot
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-2xl flex items-center gap-2">
                                <Car className="h-6 w-6" />
                                Book Parking Slot {slot.slotNumber}
                              </DialogTitle>
                              <DialogDescription>
                                Select your preferred date and time for parking
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date) => setDate(date as Date)}
                                className="rounded-md border mx-auto"
                                disabled={(date) => date < new Date()}
                              />

                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Clock className="h-5 w-5" />
                                  <Select
                                    value={startTime}
                                    onValueChange={setStartTime}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Start Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from(
                                        { length: 24 },
                                        (_, i) =>
                                          `${i.toString().padStart(2, "0")}:00`
                                      ).map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={duration}
                                    onValueChange={setDuration}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 6, 8, 12, 24].map(
                                        (hours) => (
                                          <SelectItem
                                            key={hours}
                                            value={hours.toString()}
                                          >
                                            {hours}{" "}
                                            {hours === 1 ? "hour" : "hours"}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Alert className="bg-blue-50">
                                  <Info className="h-4 w-4 text-blue-600" />
                                  <AlertDescription>
                                    Booking will start from {startTime} for{" "}
                                    {duration} hour(s)
                                  </AlertDescription>
                                </Alert>

                                <Button
                                  className="w-full bg-green-600 hover:bg-green-700"
                                  size="lg"
                                  onClick={() => bookSlot(slot.slotNumber)}
                                >
                                  <CalendarDays className="mr-2 h-4 w-4" />
                                  Confirm Booking
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {(slot.status === "occupied" || slot.status === "parked") && slot.bookedBy && (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                          {slot.bookingStart && slot.bookingEnd && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {new Date(slot.bookingStart)
                                .toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })
                                .toLowerCase()}{" "}
                              -{" "}
                              {new Date(slot.bookingEnd)
                                .toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })
                                .toLowerCase()}
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {slot.status === "occupied"
                                ? "Booked by:"
                                : "Parked by:"}
                            </span>
                            <span className="font-medium">
                              {slot.bookedBy.username}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Vehicle:
                            </span>
                            <Badge variant="outline" className="bg-white">
                              {slot.bookedBy.vehicleNumber}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Mobile:
                            </span>
                            <a
                              href={`tel:${slot.bookedBy.mobile}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              {slot.bookedBy.mobile}
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
