
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BloodRequest = {
  id: number;
  patientName: string;
  bloodGroup: string;
  units: number;
  hospitalName: string;
  city: string;
  contactNumber: string;
};

export default function RequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/blood-requests",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load blood requests.");
        }

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [router]);

  function getWhatsAppNumber(phone: string) {
    let number = phone.replace(/\D/g, "");

    // Add India's country code if a 10-digit number is stored.
    if (number.length === 10) {
      number = "91" + number;
    }

    return number;
  }

  return (
    <main className="min-h-screen bg-red-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-red-700 text-center mb-2">
          Blood Requests
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Help people in need by contacting them directly.
        </p>

        {loading && (
          <p className="text-center text-gray-600">
            Loading blood requests...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="text-center text-gray-600">
            No blood requests available.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {requests.map((request) => {
            const phone = request.contactNumber || "";
            const whatsappNumber = getWhatsAppNumber(phone);

            const message = encodeURIComponent(
              `Hello, I saw your blood request for ${request.bloodGroup}. I would like to help.`
            );

            return (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-md p-6 border border-red-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {request.patientName}
                  </h2>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                    {request.bloodGroup}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Units required:</strong> {request.units}
                  </p>

                  <p>
                    <strong>Hospital:</strong> {request.hospitalName}
                  </p>

                  <p>
                    <strong>City:</strong> {request.city}
                  </p>

                  <p>
                    <strong>Contact:</strong> {phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <a
                    href={`tel:${phone}`}
                    className="bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold"
                  >
                    📞 Call
                  </a>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg font-semibold"
                  >
                    💬 WhatsApp
                  </a>

                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <a
            href="/dashboard"
            className="text-red-700 font-semibold hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}
