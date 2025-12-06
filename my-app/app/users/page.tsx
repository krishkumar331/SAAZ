"use client"
import { useEffect, useState } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="list-disc pl-5">
        {users.length === 0 ? (
          <li>No users found.</li>
        ) : (
          users.map((u: any) => <li key={u.id}>{u.name} - {u.email}</li>)
        )}
      </ul>
    </div>
  )
}
