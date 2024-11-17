import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-2 pb-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full group bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900 text-white text-lg font-semibold shadow-lg"
            >
              Login
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full group border-2 border-gray-900 dark:border-gray-200 text-gray-800 dark:text-gray-700 hover:bg-gray-100 hover:text-white dark:hover:text-white dark:hover:bg-gray-800 text-lg font-semibold shadow-lg"
            >
              Register
              <ArrowRight className="ml-2 h-5 w-5 opacity-100 transition-all group-hover:opacity-100  group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <div className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <Car className="h-20 w-20 text-gray-800 dark:text-gray-200 animate-pulse drop-shadow-lg" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            Smart Parking System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium">
            Manage your parking spots efficiently with real-time monitoring and
            booking
          </p>
        </div>
        <div>
          {/* Parking Map */}
          <div className="w-full max-w-2xl mx-auto mb-12 p-6">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-inner border-2 border-gray-300 dark:border-gray-700">
              {/* Fence Top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-400 dark:bg-gray-600 flex space-x-1">
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 -mt-3 bg-gray-400 dark:bg-gray-600"
                  ></div>
                ))}
              </div>

              {/* Fence Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400 dark:bg-gray-600 flex space-x-1">
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 -mb-3 bg-gray-400 dark:bg-gray-600"
                  ></div>
                ))}
              </div>

              {/* Fence Left */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-400 dark:bg-gray-600 flex flex-col space-y-1">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-4 -ml-3 bg-gray-400 dark:bg-gray-600"
                  ></div>
                ))}
              </div>

              {/* Pathway */}
              <div className="absolute left-0 right-0 top-1/2 h-24 -mt-12 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700">
                {/* Pathway markings */}
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-2 flex justify-between">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-12 h-2 bg-white dark:bg-gray-400"
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Entry Barrier - Vertical Orientation */}
                <div className="absolute right-4 top-0 bottom-0 w-6 flex items-center justify-center">
                  {/* Barrier Base */}
                  <div className="absolute bottom-0 w-6 h-8 bg-gradient-to-t from-gray-600 to-gray-500 dark:from-gray-700 dark:to-gray-600 rounded-t-lg shadow-lg">
                    {/* 3D effect for base */}
                    <div className="absolute left-0 w-1 h-full bg-gray-700 dark:bg-gray-800"></div>
                  </div>
                  {/* Barrier Arm */}
                  <div className="absolute h-full w-6 origin-bottom transform transition-transform duration-700 ease-in-out cursor-pointer hover:-rotate-90 active:-rotate-90">
                    <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 rounded-t-lg shadow-lg">
                      <div className="h-full w-2 flex flex-col justify-between py-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 w-full bg-red-500 dark:bg-red-600"
                          ></div>
                        ))}
                      </div>
                    </div>
                    {/* 3D effect for arm */}
                    <div className="absolute left-0 h-full w-1 bg-yellow-300 dark:bg-yellow-400"></div>
                  </div>
                </div>
              </div>

              {/* Parking Slots - Top Side */}
              <div className="grid grid-cols-2 gap-6 mb-28">
                <div className="h-28 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Slot 1
                  </span>
                </div>
                <div className="h-28 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Slot 2
                  </span>
                </div>
              </div>

              {/* Parking Slots - Bottom Side */}
              <div className="grid grid-cols-2 gap-6 mt-28">
                <div className="h-28 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Slot 3
                  </span>
                </div>
                <div className="h-28 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Slot 4
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
