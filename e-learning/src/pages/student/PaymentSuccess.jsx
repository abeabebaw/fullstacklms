import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import Footer from '../../components/student/Footer';
import { apiService } from '../../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { fetchUserEnrolledCourses } = useContext(AppContext);
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const tx_ref = searchParams.get('tx_ref');
      
      if (!tx_ref) {
        setStatus('error');
        setMessage('Invalid payment reference. Please contact support.');
        return;
      }

      try {
        const token = await getToken();
        const result = await apiService.verifyPayment(tx_ref, token);

        if (result.success) {
          setStatus('success');
          setMessage('Payment successful! You are now enrolled in the course.');

          // Refresh enrolled courses
          await fetchUserEnrolledCourses();

          // If the API returned the purchased courseId, navigate to the course page so the
          // details are re-fetched with authentication and paid videos become accessible.
          const purchasedCourseId = result.courseId;
          if (purchasedCourseId) {
            // short delay so the user sees the success state momentarily
            setTimeout(() => {
              navigate(`/courses/${purchasedCourseId}`);
            }, 6000);
          } else {
            // fallback: go to enrollments after a short delay
            setTimeout(() => {
              navigate('/my-enrollments');
            }, 4000);
          }
        } else {
          setStatus('error');
          setMessage(result?.message || result?.error || 'Payment verification failed. Please contact support if amount was deducted.');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('Error verifying payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, getToken, fetchUserEnrolledCourses]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-cyan-50 via-white to-white">
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Verifying Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border-t-4 border-green-500">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <svg
                    className="w-16 h-16 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 text-lg">
                  {message}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  🎉 Congratulations! You can now access all course materials.
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to your enrollments in a moment...
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => navigate('/my-enrollments')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Go to My Enrollments
                </button>
                <button
                  onClick={() => navigate('/course-list')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Browse More Courses
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border-t-4 border-red-500">
              <div className="flex justify-center">
                <div className="bg-red-100 rounded-full p-4">
                  <svg
                    className="w-16 h-16 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Payment Failed
                </h2>
                <p className="text-gray-600">
                  {message}
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  Need Help?
                </p>
                <p className="text-xs text-gray-600">
                  If money was deducted from your account, please contact our support team with your transaction reference.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/course-list')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Back to Courses
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <Footer />
      </footer>
    </div>
  );
};

export default PaymentSuccess;
