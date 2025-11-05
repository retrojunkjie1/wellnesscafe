import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import AssistantDirectoryFS from "../features/assistance/AssistantDirectoryFS";

const ALLOWED = ["sobriety","housing","legal","funding"];

const AssistantsPage = ()=>{
  const { type } = useParams();
  const t = (type||'').toLowerCase();
  const safe = ALLOWED.includes(t) ? t : 'sobriety';
  return (
    <div className="page">
      <Header />
      <AssistantDirectoryFS type={safe} />
    </div>
  );
};

export default AssistantsPage;
