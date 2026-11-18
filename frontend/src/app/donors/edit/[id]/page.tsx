
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:8080";

interface Donor {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  city: string;
}

export default function EditDonorPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing donor details from Java backend
  useEffect(() => {
    if (!id) return;

    const loadDonor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/donors/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load donor details.");
        }

        const donor: Donor = data;

        setName(donor.name || "");
        setAge(String(donor.age ?? ""));
        setBloodGroup(donor.bloodGroup || "");
        setPhone(donor.phone || "");
        setCity(donor.city || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading donor details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDonor();
  }, [id, router]);

  // Update donor details in Java backend
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      setError("Donor ID is missing.");
      return;
    }

    if (!name.trim() || !city.trim()) {
      setError("Please enter valid name and city.");
      return;
    }

    if (Number(age) < 18 || Number(age) > 65) {
      setError("Donor age must be between 18 and 65.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // First get CSRF token
      const csrfResponse = await fetch(`${API_URL}/api/csrf`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to get security token. Please login again.");
      }

      const csrfData = await csrfResponse.json();

      // Send updated donor details
      const response = await fetch(
        `${API_URL}/api/donors/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            [csrfData.headerName]: csrfData.token,
          },
          body: JSON.stringify({
            name: name.trim(),
            age: Number(age),
            bloodGroup,
            phone,
            city: city.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Donor update failed.");
      }

      alert("Donor details updated successfully!");

      router.push("/donors");
      router.refresh();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating donor."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-red-50 flex items-center justify-center p-5">
        <p className="text-red-700 font-semibold">
          Loading donor details...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-red-50 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-red-700 text-center mb-2">
          Edit Donor Details
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Donor ID: {id}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="65"
              placeholder="Enter your age"
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Blood Group
            </label>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10 digit phone number"
              pattern="[0-9]{10}"
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">City</label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-700 text-white p-3 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400"
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>

        </form>

        <div className="text-center mt-5">
          <Link
            href="/donors"
            className="text-red-700 font-semibold hover:underline"
          >
            Back to Registered Donors
          </Link>
        </div>

      </div>
    </main>
  );
}
