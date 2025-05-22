// import React from 'react';
// import Navbar from '../components/Navbar';
// import { useTheme } from '../context/ThemeContext';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';


// const SignupSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   phoneNumber: Yup.string()
//     .required('Phone number is required')
//     .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
//   email: Yup.string()
//     .email('Invalid email address')
//     .required('Email is required'),
//   password: Yup.string()
//     .required('Password is required')
//     .min(6, 'Password must be at least 6 characters'),
// });



// const SignupNamePasswordPage = () => {
//  const { isDarkMode } = useTheme();

//   const handleSignup = (values:any) => {
//     console.log('Signup Values:', values);
//   };

//   return (
//     <div className={`${isDarkMode ? 'bg-[#1b1818] text-white' : 'bg-gray-200 text-black'} min-h-screen`}>
//       <Navbar />
//       <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
//         <div
//           className={`rounded-2xl shadow-lg p-8 w-full max-w-md ${
//             isDarkMode ? 'bg-[#2d2c2c] text-white' : 'bg-white text-black'
//           }`}
//         >
//           <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
//           <p className="text-center text-sm mb-6">
//             Join Voice Drop to share and communicate effortlessly. Let's get started!
//           </p>
//           <Formik
//             initialValues={{phoneNumber: ''}}
//             validationSchema={SignupSchema}
//             onSubmit={handleSignup}
//           >
//             {() => (
//               <Form>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-2" htmlFor="name">
//                     Name
//                   </label>
//                   <Field
//                     type="text"
//                     id="name"
//                     name="name"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <ErrorMessage
//                     name="name"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-2" htmlFor="phoneNumber">
//                     Phone Number
//                   </label>
//                   <Field
//                     type="text"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <ErrorMessage
//                     name="phoneNumber"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-2" htmlFor="email">
//                     Email
//                   </label>
//                   <Field
//                     type="email"
//                     id="email"
//                     name="email"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-2" htmlFor="password">
//                     Password
//                   </label>
//                   <Field
//                     type="password"
//                     id="password"
//                     name="password"
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
//                 >
//                   Finish
//                 </button>
//               </Form>
//             )}
//           </Formik>
//           <div className="mt-4 text-center">
//             <p className="text-sm">
//               Already have an account?{' '}
//               <span
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//                 onClick={() => console.log('Login Clicked')}
//               >
//                 Login
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupNamePasswordPage
