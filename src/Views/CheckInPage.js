import React, {useState} from "react";
import Header from "../components/Header";
import CheckIn from "../components/CheckIn";

const CheckInPage = ()=>{
  const [done,setDone]=useState(false);
  return (
    <div className="page">
      <Header />
      <main className="container">
        {!done ? (
          <CheckIn onComplete={()=>setDone(true)} />
        ) : (
          <div className="checkin-container" style={{textAlign:"center", padding:"2rem 1rem"}}>
            <h2>Check‑in Complete</h2>
            <p className="text-gray-700" style={{marginTop:"0.5rem"}}>Nice work. Your reflection is saved.</p>
            <div style={{display:"flex", gap:"0.75rem", justifyContent:"center", marginTop:"1rem"}}>
              <a className="btn" href="/dashboard">Go to Dashboard</a>
              <a className="ghost-btn" href="/product">Back to Product</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckInPage;
