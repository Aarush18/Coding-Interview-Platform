"use client"

import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import LoaderUI from "@/components/LoaderUI";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation"
import { useState } from "react";

function MeetingPage() {

  const {id} = useParams();
  const {isLoaded} = useUser()
  const [isSetupComplete , setIsSetupComplete] = useState(false);
  const {call , isCallLoading} = useGetCallById(id);


  if(!isLoaded || isCallLoading) return <LoaderUI/>


  if(!call){
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found </p>
      </div>
    )
  }
  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete = {() => setIsSetupComplete(true)}/>
        ) : (
          <MeetingRoom/>
        )}
      </StreamTheme>

    </StreamCall>
  )
}

export default MeetingPage