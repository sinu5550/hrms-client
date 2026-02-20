import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Navigation,
  History,
} from "lucide-react";

export default function Attendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationStatus, setLocationStatus] = useState<
    "checking" | "valid" | "invalid"
  >("checking");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);

  // Office geofence coordinates (mock)
  const officeLocation = { lat: 37.7749, lng: -122.4194 };
  const geofenceRadius = 100; // meters

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLoc);

          // Calculate distance (simplified)
          const distance = calculateDistance(userLoc, officeLocation);
          setLocationStatus(distance <= geofenceRadius ? "valid" : "invalid");
        },
        () => {
          setLocationStatus("invalid");
        },
      );
    }

    return () => clearInterval(timer);
  }, []);

  const calculateDistance = (
    _loc1: { lat: number; lng: number },
    _loc2: { lat: number; lng: number },
  ) => {
    // Simplified distance calculation (mock)
    return Math.random() * 50; // Returns a random distance for demo
  };

  const handleCheckIn = () => {
    if (locationStatus === "valid") {
      setCheckedIn(true);
      setCheckInTime(new Date());
    }
  };

  const handleCheckOut = () => {
    if (locationStatus === "valid") {
      setCheckOutTime(new Date());
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const todayStats = {
    checkIn: "09:00 AM",
    expectedCheckOut: "06:00 PM",
    workHours: "9 hours",
    status: checkedIn
      ? checkOutTime
        ? "Checked Out"
        : "Present"
      : "Not Checked In",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Attendance</h1>
          <p className="text-gray-600 mt-1">
            Mark your attendance and track your work hours
          </p>
        </div>
        <Link
          to="/attendance/records"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <History className="w-5 h-5" />
          View Records
        </Link>
      </div>

      {/* Current Time & Date */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-8 mb-6 text-white">
        <div className="text-center">
          <p className="text-white/80 mb-2">{formatDate(currentTime)}</p>
          <p className="text-5xl font-semibold mb-6">
            {formatTime(currentTime)}
          </p>

          {/* Location Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Navigation className="w-5 h-5" />
            {locationStatus === "checking" && (
              <span className="text-white/90">Checking location...</span>
            )}
            {locationStatus === "valid" && (
              <span className="text-white/90">
                ✓ You are within office premises
              </span>
            )}
            {locationStatus === "invalid" && (
              <span className="text-white/90">
                ✗ You are outside office premises
              </span>
            )}
          </div>

          {/* Check-in/Check-out Buttons */}
          <div className="flex gap-4 justify-center">
            {!checkedIn && (
              <button
                onClick={handleCheckIn}
                disabled={locationStatus !== "valid"}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  locationStatus === "valid"
                    ? "bg-white text-[#1a5f3f] hover:bg-gray-100"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                <Clock className="w-5 h-5 inline mr-2" />
                Check In
              </button>
            )}
            {checkedIn && !checkOutTime && (
              <button
                onClick={handleCheckOut}
                disabled={locationStatus !== "valid"}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  locationStatus === "valid"
                    ? "bg-white text-[#1a5f3f] hover:bg-gray-100"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                <Clock className="w-5 h-5 inline mr-2" />
                Check Out
              </button>
            )}
          </div>

          {checkInTime && (
            <div className="mt-4 text-white/90">
              <p>Checked in at: {formatTime(checkInTime)}</p>
            </div>
          )}
          {checkOutTime && (
            <div className="mt-2 text-white/90">
              <p>Checked out at: {formatTime(checkOutTime)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Validation Info */}
      {locationStatus === "invalid" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">
              Location Validation Failed
            </p>
            <p className="text-sm text-red-600 mt-1">
              You must be within the office geofence area to mark attendance.
              Please ensure:
            </p>
            <ul className="text-sm text-red-600 mt-2 ml-4 list-disc">
              <li>Location services are enabled</li>
              <li>You are physically present at the office</li>
              <li>GPS signal is strong</li>
            </ul>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Check-in Time</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {checkInTime ? formatTime(checkInTime) : todayStats.checkIn}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Check-out Time</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {checkOutTime
                  ? formatTime(checkOutTime)
                  : todayStats.expectedCheckOut}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Work Hours</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {todayStats.workHours}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {todayStats.status}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                checkedIn ? "bg-green-100" : "bg-orange-100"
              }`}
            >
              {checkedIn ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GPS Map Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Office Location & Geofence
        </h2>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Office Location Map</p>
            <p className="text-sm text-gray-500 mt-1">
              {location
                ? `Your location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : "Fetching your location..."}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> AI-powered fake location detection is active.
            Any attempt to spoof your location will be flagged.
          </p>
        </div>
      </div>
    </div>
  );
}
