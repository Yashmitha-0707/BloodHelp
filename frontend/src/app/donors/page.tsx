
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Donor {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
  phone: string;
  verified: boolean;
  available: boolean;
  canEdit: boolean;
}

const API_URL = "http://localhost:8080";

export default function DonorsPage() {
  const router = useRouter();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDonors() {
      try {
        const response = await fetch(`${API_URL}/api/donors`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load donors. Status: ${response.status}`
          );
        }

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            "Backend did not return JSON. Check API configuration."
          );
        }

        const data: Donor[] = await response.json();
        setDonors(data);

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

    fetchDonors();
  }, [router]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donor?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(id);

    try {
      const csrfResponse = await fetch(`${API_URL}/api/csrf`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (csrfResponse.status === 401) {
        router.push("/login");
        return;
      }

      if (!csrfResponse.ok) {
        throw new Error("Unable to prepare deletion.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(`${API_URL}/api/donors/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          [csrfData.headerName]: csrfData.token,
        },
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You cannot delete another user's donor."
        );
      }

      if (response.status === 404) {
        throw new Error("Donor not found.");
      }

      if (!response.ok) {
        throw new Error("Unable to delete donor.");
      }

      setDonors((previous) =>
        previous.filter((donor) => donor.id !== id)
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function getWhatsAppNumber(phone: string) {
    let number = phone.replace(/\D/g, "");

    if (number.length === 10) {
      number = "91" + number;
    }

    return number;
  }

  return (
    <main className="min-h-screen bg-red-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-red-700 text-center mb-8">
          Registered Donors
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">

            <thead>
              <tr className="bg-red-700 text-white">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Age</th>
                <th className="p-3 border">Blood Group</th>
                <th className="p-3 border">City</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center border">
                    Loading donors...
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center border text-gray-600">
                    No donors registered yet.
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-red-50">

                    <td className="p-3 border">{donor.id}</td>

                    <td className="p-3 border">{donor.name}</td>

                    <td className="p-3 border">{donor.age}</td>

                    <td className="p-3 border font-semibold text-red-700">
                      {donor.bloodGroup}
                    </td>

                    <td className="p-3 border">{donor.city}</td>

                    <td className="p-3 border">
                      <div className="flex flex-wrap gap-2 min-w-[230px]">

                        {donor.canEdit && (
                          <>
                            <Link
                              href={`/donors/edit/${donor.id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
                            >
                              ✏️ Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(donor.id)}
                              disabled={deletingId === donor.id}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                            >
                              {deletingId === donor.id
                                ? "Deleting..."
                                : "🗑️ Delete"}
                            </button>
                          </>
                        )}

                        <a
                          href={`tel:${donor.phone}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
                        >
                          📞 Call
                        </a>

                        <a
                          href={`https://wa.me/${getWhatsAppNumber(donor.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm"
                        >
                          💬 WhatsApp
                        </a>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">

          <Link
            href="/register"
            className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800"
          >
            Register Another Donor
          </Link>

          <Link
            href="/"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}
