import React, { useState } from "react";
import html2canvas from "html2canvas";
import logo from './logo.png'
import jsPDF from "jspdf";

// const CertificateApp = () => {
//     // State to store user inputs
//     const [formData, setFormData] = useState({
//         name: "",
//         courseName: "",
//         companyName: "",
//         date: "",
//     });

//     // Handle form input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // // Generate PDF function
//     // const generatePDF = () => {
//     //     const certificate = document.getElementById("certificate");
//     //     html2canvas(certificate, { scale: 2 }).then((canvas) => {
//     //         const pdf = new jsPDF("landscape", "pt", "a4");
//     //         const imgData = canvas.toDataURL("image/png");
//     //         pdf.addImage(imgData, "PNG", 0, 0, 841.89, 595.28);
//     //         pdf.save(`${formData.name}.pdf`);
//     //     });
//     // };

//     // Generate PNG function
//     // const generatePNG = () => {
//     //     const certificate = document.getElementById("certificate");
//     //     html2canvas(certificate, { scale: 2 }).then((canvas) => {
//     //         const link = document.createElement("a");
//     //         link.download = `${formData.name}.png`;
//     //         link.href = canvas.toDataURL("image/png");
//     //         link.click();
//     //     });
//     // };

//     const generatePDF = () => {
//         const certificate = document.getElementById("certificate");

//         // Use a higher scale for better resolution
//         html2canvas(certificate, { scale: 4 }).then((canvas) => {
//             const imgWidth = 841.89; // A4 width in points
//             const imgData = canvas.toDataURL("image/png", 1.0); // Max quality image data    
//             // Create PDF with jsPDF
//             const pdf = new jsPDF("landscape", "pt", "a4");
//             pdf.addImage(imgData, "PNG", 0, 0, imgWidth, 595.28);
//             pdf.save(`${formData.name}.pdf`);
//         }).catch((error) => {
//             console.error("Error generating PDF:", error);
//         });
//     };


//     return (
//         // <div style={{ fontFamily: "serif", padding: "20px" }}>
//         //     <div style={{ marginBottom: "20px", textAlign: "left" }}>

//         //         <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginLeft: "35%", marginBottom: "30px" }}>
//         //             {/* Name Input */}
//         //             <label>
//         //                 Name:
//         //                 <input
//         //                     type="text"
//         //                     name="name"
//         //                     required
//         //                     value={formData.name}
//         //                     onChange={handleInputChange}
//         //                     placeholder="Enter your name"
//         //                     style={{
//         //                         width: "100%",
//         //                         padding: "8px",
//         //                         marginTop: "5px",
//         //                         borderRadius: "4px",
//         //                         border: "1px solid #ccc",
//         //                     }}

//         //                 />
//         //             </label>

//         //             {/* Course Name Input */}
//         //             <label>
//         //                 Course Name:
//         //                 <input
//         //                     type="text"
//         //                     name="courseName"
//         //                     value={formData.courseName}
//         //                     onChange={handleInputChange}
//         //                     placeholder="Enter course name"
//         //                     style={{
//         //                         width: "100%",
//         //                         padding: "8px",
//         //                         marginTop: "5px",
//         //                         borderRadius: "4px",
//         //                         border: "1px solid #ccc",
//         //                     }}
//         //                     required
//         //                 />
//         //             </label>
//         //             {/* Company Name Input */}
//         //             <label>
//         //                 Company Name:
//         //                 <input
//         //                     type="text"
//         //                     name="companyName"
//         //                     value={formData.companyName}
//         //                     onChange={handleInputChange}
//         //                     placeholder="Enter company name"
//         //                     style={{
//         //                         width: "100%",
//         //                         padding: "8px",
//         //                         marginTop: "5px",
//         //                         borderRadius: "4px",
//         //                         border: "1px solid #ccc",
//         //                     }}
//         //                     required
//         //                 />
//         //             </label>
//         //             {/* Date Input */}
//         //             <label>
//         //                 Date:
//         //                 <input
//         //                     type="date"
//         //                     name="date"
//         //                     value={formData.date}
//         //                     onChange={handleInputChange}
//         //                     style={{
//         //                         width: "100%",
//         //                         padding: "8px",
//         //                         marginTop: "5px",
//         //                         borderRadius: "4px",
//         //                         border: "1px solid #ccc",
//         //                     }}
//         //                     required
//         //                 />
//         //             </label>
//         //         </form>
//         //     </div>
// <div style={{ fontFamily: "serif", padding: "20px" }}>
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       marginBottom: "30px",
//     }}
//   >
//     <form
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px",
//         width: "400px",
//         background: "#f9f9f9",
//         padding: "25px 30px",
//         borderRadius: "10px",
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       {/* Name Input */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <label style={{ width: "130px", fontWeight: "bold" }}>Name:</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           placeholder="Enter your name"
//           style={{
//             flex: 1,
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//           required
//         />
//       </div>

//       {/* Course Name Input */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <label style={{ width: "130px", fontWeight: "bold" }}>Course Name:</label>
//         <input
//           type="text"
//           name="courseName"
//           value={formData.courseName}
//           onChange={handleInputChange}
//           placeholder="Enter course name"
//           style={{
//             flex: 1,
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//           required
//         />
//       </div>

//       {/* Company Name Input */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <label style={{ width: "130px", fontWeight: "bold" }}>Company Name:</label>
//         <input
//           type="text"
//           name="companyName"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           placeholder="Enter company name"
//           style={{
//             flex: 1,
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//           required
//         />
//       </div>

//       {/* Date Input */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <label style={{ width: "130px", fontWeight: "bold" }}>Date:</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleInputChange}
//           style={{
//             flex: 1,
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//           required
//         />
//       </div>
//     </form>
//   </div>


//             {/* Certificate Section */}
//             <div style={{ fontFamily: "sans-serif" }}>
//                 <div
//                     id="certificate"
//                     style={{
//                         width: "880px",
//                         height: "595px",
//                         padding: "20px",
//                         color: "white",
//                         backgroundImage: `url(${require('./background1.jpeg')})`,
//                         backgroundSize: "cover",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                         backgroundColor: "#fff",
//                         position: "relative",
//                         margin: "auto",
//                     }}
//                 >
//                     {/* <img
//                         src={logo}
//                         alt="Logo"
//                         // style={{
//                         //   width: "400px",
//                         //   marginTop:"300px",
//                         //   margin:"0 auto",
//                         // }}
//                         style={{
//                             width: "380px",
//                             position: "absolute",
//                             top: "17%",
//                             left: "51%",
//                             transform: "translate(-50%, -50%)",
//                         }}
//                     /> */}
//                     {/* <h1 style={{ width: "100%", fontSize: "29px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", textTransform: "uppercase", color: "#ead23e", top: "30%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }}>
//                         Certificate of Appreciation
//                     </h1> */}
//                     <div
//                         style={{
//                             alignItems: "center",
//                             width: "50%",
//                             fontFamily: "Optima, sans-serif",
//                             color: "#f0ecda",
//                             fontStyle: "italic",
//                             textAlign: "center",
//                         }}
//                     >
//                         <h6
//                             style={{
//                                 position: "absolute",
//                                 top: "47%",
//                                 paddingLeft: "26%",
//                                 fontSize: "17px",
//                                 fontWeight: "bold",
//                             }}
//                         >
//                             {formData.name}
//                         </h6>
//                         <h6
//                             style={{
//                                 position: "absolute",
//                                 top: "51.2%",
//                                 paddingLeft: "26%",
//                                 fontSize: "17px",
//                                 fontWeight: "bold",
//                             }}
//                         >
//                             {formData.courseName}
//                         </h6>
//                         <h6
//                             style={{
//                                 position: "absolute",
//                                 top: "62%",
//                                 paddingLeft: "26%",
//                                 textAlign: "center",
//                                 fontSize: "17px",
//                                 fontWeight: "bold",
//                             }}
//                         >
//                             {formData.companyName}
//                         </h6>
//                         <h6
//                             style={{
//                                 position: "absolute",
//                                 top: "84%",
//                                 paddingLeft: "68%",
//                                 fontSize: "15px",
//                                 fontWeight: "bold",
//                             }}
//                         >
//                             {formData.date}
//                         </h6>
//                     </div>
//                 </div>
//             </div>

//             {/* Download Button */}
//             <div style={{ textAlign: "center", marginTop: "20px" }}>
//                 <button
//                     onClick={generatePDF}
//                     style={{
//                         padding: "10px 20px",
//                         fontSize: "16px",
//                         cursor: "pointer",
//                         borderRadius: "5px",
//                         backgroundColor: "#007BFF",
//                         color: "#fff",
//                         border: "none",
//                     }}
//                 >
//                     Download Certificate
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CertificateApp;
// import React, { useState } from "react";
// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";
import background3 from "./background3.jpeg"; // ✅ import your background

const CertificateApp = () => {
  const [formData, setFormData] = useState({
    name: "",
    courseName: "",
    companyName: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generatePDF = () => {
    const certificate = document.getElementById("certificate");
    html2canvas(certificate, { scale: 4 }).then((canvas) => {
      const imgWidth = 841.89;
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "pt", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, 595.28);
      pdf.save(`${formData.name}.pdf`);
    });
  };

  return (
    <div style={{ fontFamily: "serif", padding: "20px" }}>
      {/* === Input Form === */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "400px",
            background: "#f9f9f9",
            padding: "25px 30px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "130px", fontWeight: "bold" }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "130px", fontWeight: "bold" }}>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              placeholder="Enter course name"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "130px", fontWeight: "bold" }}>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "130px", fontWeight: "bold" }}>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        </form>
      </div>

      {/* === Certificate Section === */}
      <div
        id="certificate"
        style={{
          width: "880px",
          height: "595px",
          position: "relative",
          margin: "auto",
          backgroundImage: `url(${background3})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          color: "white",
          fontFamily: "Optima, sans-serif",
        }}
      >
        {/* Name */}
        <h6
          style={{
            position: "absolute",
            top: "300px", // aligned with “Mr/Ms”
            left: "320px",
            fontSize: "18px",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#FFD700",
          }}
        >
          {formData.name}
        </h6>

        {/* Course */}
        <h6
          style={{
            position: "absolute",
            top: "330px",
            left: "320px",
            fontSize: "18px",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#FFD700",
          }}
        >
          {formData.courseName}
        </h6>

        {/* Company */}
        <h6
          style={{
            position: "absolute",
            top: "380px",
            left: "320px",
            fontSize: "18px",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#FFD700",
          }}
        >
          {formData.companyName}
        </h6>

        {/* Date */}
        <h6
          style={{
            position: "absolute",
            bottom: "100px",
            right: "200px",
            fontSize: "16px",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#FFD700",
          }}
        >
          {formData.date}
        </h6>
      </div>

      {/* === Download Button === */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={generatePDF}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
          }}
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateApp;

