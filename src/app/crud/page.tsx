"use client";

import RequireAuth from "@/components/RequireAuth";
import SignOutButton from "@/components/SignOutButton";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

type UserRow = {
  id: number;
  created_at: string;
  name: string;
  comments: string;
  cgpa: number;
};

export default function CrudPage() {
  const [usersData, setUsersData] = useState<UserRow[]>([]);
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");
  const [cgpa, setCgpa] = useState<number | "">("");
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);

  // --- READ ---
  const fetchData = async () => {
    const { data, error } = await supabase.from("Users").select("*").order("id");
    if (error) console.error(error);
    if (data) setUsersData(data as UserRow[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CREATE / UPDATE ---
  const handleSubmit = async () => {
    if (!name || !comments || !cgpa) return;
    setLoading(true);

    if (editingUser) {
      // UPDATE
      const { error } = await supabase
        .from("Users")
        .update({ name, comments, cgpa: Number(cgpa) })
        .eq("id", editingUser.id);
      if (error) console.error(error);
    } else {
      // CREATE
      const { error } = await supabase
        .from("Users")
        .insert([{ name, comments, cgpa: Number(cgpa) }]);
      if (error) console.error(error);
    }

    setLoading(false);
    resetForm();
    fetchData();
  };

  // --- DELETE ---
  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    const { error } = await supabase.from("Users").delete().eq("id", id);
    if (error) console.error(error);
    setLoading(false);
    fetchData();
  };

  // --- START EDIT ---
  const startEdit = (user: UserRow) => {
    setEditingUser(user);
    setName(user.name);
    setComments(user.comments);
    setCgpa(user.cgpa);
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setEditingUser(null);
    setName("");
    setComments("");
    setCgpa("");
  };

  return (
    <RequireAuth>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">CRUD App</h1>
          <SignOutButton />
        </div>

        {/* FORM */}
        <div className="mb-6 space-y-2">
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="CGPA"
            value={cgpa}
            onChange={(e) => setCgpa(Number(e.target.value))}
          />

          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingUser
                ? "Update User"
                : "Add User"}
            </button>

            {editingUser && (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <ul className="space-y-4">
          {usersData.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p>{user.comments}</p>
                <p className="text-sm text-gray-500">CGPA: {user.cgpa}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded"
                  onClick={() => startEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </RequireAuth>
  );
}
