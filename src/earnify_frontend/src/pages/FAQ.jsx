import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Earnify?",
      answer: "Earnify is a decentralized platform that connects freelancers with job opportunities and bounties on the Internet Computer blockchain. It enables users to earn cryptocurrency for completing tasks and projects."
    },
    {
      question: "How do I get started?",
      answer: "To get started, you'll need to create an account using Internet Identity, set up your profile, and connect your wallet. Once your profile is complete, you can start browsing jobs and bounties or post your own opportunities."
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed through the Internet Computer blockchain. When a job or bounty is completed, the payment is automatically transferred to your wallet. You can view your earnings and transaction history in your wallet sidebar."
    },
    {
      question: "What types of jobs are available?",
      answer: "Earnify hosts a variety of jobs and bounties across different categories including development, design, writing, marketing, and more. Each job listing includes detailed requirements and compensation information."
    },
    {
      question: "How do I post a job or bounty?",
      answer: "To post a job or bounty, you need to be logged in and have a verified account. Navigate to the 'Create Job' or 'Create Bounty' page, fill out the required information, set your budget, and submit. Your listing will be reviewed and published shortly."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "In case of disputes, our support team will review the case and work with both parties to reach a resolution. We recommend maintaining clear communication and documenting all interactions through our platform."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we take security seriously. All data is stored on the Internet Computer blockchain, and we use industry-standard encryption for sensitive information. Your wallet and personal data are protected by the same security measures used by major financial institutions."
    },
    {
      question: "Can I use Earnify internationally?",
      answer: "Yes, Earnify is available globally. However, please check your local regulations regarding cryptocurrency usage and ensure compliance with applicable laws."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about using Earnify
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`h-5 w-5 text-gray-500 transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help!
        </p>
        <Link
          to="/support"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default FAQ; 