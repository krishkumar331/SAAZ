"use client"
import { useState } from 'react'

export default function Payment() {
  const [status, setStatus] = useState('idle')

  const handlePayment = () => {
    setStatus('processing')
    // Simulate a free payment gateway (e.g., Sandbox)
    setTimeout(() => {
      setStatus('success')
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
        <p className="mb-8 text-gray-600">Total Amount: <span className="font-bold text-black">$0.00 (Free Trial)</span></p>

        {status === 'success' ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            Payment Successful! Welcome aboard.
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {status === 'processing' ? 'Processing...' : 'Pay Now (Free)'}
          </button>
        )}
        <p className="mt-4 text-xs text-gray-400">Secured by MockPay</p>
      </div>
    </div>
  )
}
