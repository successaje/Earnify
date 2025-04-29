import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      title: "The Basics",
      icon: "🤙",
      questions: [
        {
          question: "What is Earnify?",
          answer: "Earnify is a decentralized platform on the Internet Computer blockchain that connects freelancers with job opportunities and bounties. It enables users to earn cryptocurrency for completing tasks and projects, with all transactions secured by blockchain technology."
        },
        {
          question: "What are Bounties?",
          answer: "A bounty is a competitive task where multiple participants submit their work, and the best submission(s) receive rewards. Think of it as a contest where everyone attempts the same scope of work. Bounties are a great way to build your portfolio while earning cryptocurrency for excellent work."
        },
        {
          question: "What are Job Listings?",
          answer: "A job listing is an advertisement for hiring a freelancer, where applicants fill out a custom application form and the best applicant(s) get selected to complete the work. Unlike bounties, only the selected applicant(s) complete the scope of work."
        },
        {
          question: "What is the difference between Bounties and Job Listings?",
          answer: "The main difference is the number of people who complete the work. In bounties, multiple people submit their work, and the best submission(s) win. For job listings, only the selected person/team completes the work. Bounties are competitive, while job listings are more traditional hiring processes."
        }
      ]
    },
    {
      title: "Earners",
      icon: "💻",
      questions: [
        {
          question: "Who can participate on Earnify?",
          answer: "Anyone with an Internet Identity and a wallet on the Internet Computer blockchain! Our platform is open to all skill levels and backgrounds."
        },
        {
          question: "What is the payout process for completed work?",
          answer: "Payments are processed automatically through smart contracts on the Internet Computer blockchain. Once work is verified as complete, the payment is transferred directly to your wallet. For bounties, payments are made to the winning submission(s) after the sponsor reviews and selects the winners."
        },
        {
          question: "Is KYC required to receive payments?",
          answer: "For most transactions on Earnify, KYC is not required as we leverage the Internet Computer's secure identity system. However, some sponsors may have their own requirements depending on their internal processes."
        },
        {
          question: "How long does it take to receive payments?",
          answer: "For completed jobs, payments are typically processed within 24 hours after verification. For bounties, the timeline varies based on the scope of work and number of submissions, but sponsors are encouraged to review and announce winners within 7 days after the deadline."
        },
        {
          question: "Can I change my wallet address?",
          answer: "Yes, you can update your wallet address in your profile settings at any time. The wallet address in your profile at the time of payment will be used for transactions."
        },
        {
          question: "Who reviews submissions for bounties?",
          answer: "The sponsors of the listings conduct the reviews and select the winners. Earnify provides the platform and smart contracts to facilitate the process, but the evaluation criteria and selection are determined by the sponsor."
        },
        {
          question: "How do I stay updated on new listings?",
          answer: "You can enable notifications for specific categories or listings by clicking the 'Notify Me' button. You'll receive alerts when new opportunities match your interests or when there are updates to listings you're following."
        },
        {
          question: "How do I submit to a bounty or apply for a job?",
          answer: "Sign up with Internet Identity → complete your profile → browse listings → click 'Apply' or 'Submit' on the listing you're interested in. Follow the instructions provided by the sponsor to complete your application or submission."
        },
        {
          question: "Do I receive confirmation of my application?",
          answer: "Yes, you'll receive a confirmation email and a notification in your dashboard when your application or submission is successfully received."
        },
        {
          question: "Can I edit my submission after submitting?",
          answer: "Yes, you can edit your submission until the deadline of the listing has passed. After the deadline, submissions are locked for review."
        }
      ]
    },
    {
      title: "Sponsors",
      icon: "💵",
      questions: [
        {
          question: "What can I use Earnify for?",
          answer: "Earnify is a platform to get work done from talent familiar with the Internet Computer ecosystem. You can post bounties to get multiple submissions for the same task, or hire freelancers through job listings. The platform is suitable for various tasks including development, design, writing, research, and more."
        },
        {
          question: "Who can post listings on Earnify?",
          answer: "Anyone with an Internet Identity can post listings on Earnify. The platform is particularly popular among projects building on the Internet Computer blockchain, but is open to all types of work."
        },
        {
          question: "How do I pay for completed work?",
          answer: "Payments are processed through smart contracts on the Internet Computer blockchain. For job listings, you'll approve the completed work, and the payment will be automatically transferred to the freelancer's wallet. For bounties, you'll select the winning submission(s) and the rewards will be distributed accordingly."
        },
        {
          question: "What happens if there's a dispute?",
          answer: "We encourage both parties to resolve disputes amicably. If an agreement can't be reached, you can contact our support team, and we'll help mediate the situation based on the evidence provided by both parties."
        },
        {
          question: "How do I create an effective listing?",
          answer: "Be specific about your requirements, provide clear instructions, set realistic deadlines, and offer competitive compensation. Include examples of similar work if possible, and be transparent about your expectations and evaluation criteria."
        }
      ]
    },
    {
      title: "Technical",
      icon: "🔧",
      questions: [
        {
          question: "What wallets are supported?",
          answer: "Earnify supports all wallets compatible with the Internet Computer blockchain. This includes wallets like Plug, Stoic, and others that can connect to Internet Computer dApps."
        },
        {
          question: "How secure are transactions on Earnify?",
          answer: "All transactions on Earnify are secured by the Internet Computer blockchain. Smart contracts handle escrow and payments, ensuring that funds are only released when work is verified as complete. This eliminates the need for trust between parties."
        },
        {
          question: "What happens if the blockchain has issues?",
          answer: "While the Internet Computer is designed to be highly reliable, in the rare case of network issues, transactions may be delayed. In such situations, our support team will assist you in resolving any problems."
        },
        {
          question: "How do I connect my wallet to Earnify?",
          answer: "When you first use Earnify, you'll be prompted to connect your wallet. Click the 'Connect Wallet' button and follow the instructions from your wallet provider. You'll need to approve the connection to allow Earnify to interact with your wallet."
        }
      ]
    },
    {
      title: "Community",
      icon: "🤝",
      questions: [
        {
          question: "How can I join the Earnify community?",
          answer: "You can join our Discord community by clicking on this invite link: <a href='https://discord.gg/UBnq7c44' target='_blank' rel='noopener noreferrer' className='text-indigo-600 hover:text-indigo-800 underline'>https://discord.gg/UBnq7c44</a>. Our Discord is a great place to connect with other users, share experiences, and get help from the community."
        },
        {
          question: "What resources are available for new users?",
          answer: "We offer several resources to help you get started: our FAQ (which you're reading now), our Discord community, and our support team. You can also check out our blog for tips and best practices for using Earnify effectively."
        },
        {
          question: "How can I provide feedback about Earnify?",
          answer: "We value your feedback! You can share your thoughts through our Discord community, by emailing support@earnify.com, or by using the feedback form in your account settings. Your input helps us improve the platform for everyone."
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Earnify FAQ</h1>
        <p className="text-lg text-gray-600 mb-6">
          Find answers to common questions about using Earnify
        </p>
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-indigo-700">
                We've tried to cover all common questions here. If you have anything else to ask us, please reach out to <a href="mailto:support@earnify.com" className="font-medium underline">support@earnify.com</a> or join our <a href="https://discord.gg/UBnq7c44" target="_blank" rel="noopener noreferrer" className="font-medium underline">Discord community</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {category.questions.map((faq, index) => (
                <div key={index} className="border-gray-200">
                  <button
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => toggleAccordion(`${categoryIndex}-${index}`)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`h-5 w-5 text-gray-500 transform ${
                          openIndex === `${categoryIndex}-${index}` ? 'rotate-180' : ''
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
                  {openIndex === `${categoryIndex}-${index}` && (
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/support"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Contact Support
          </Link>
          <a
            href="https://discord.gg/UBnq7c44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Join Discord Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 