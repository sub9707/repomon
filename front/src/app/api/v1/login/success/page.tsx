"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isToken, setIsToken] = useState<boolean>(false);

  useEffect(() => {
    if (isToken) {
      console.log("푸헤헤헤헤헤헤헤헤ㅔ");
      console.log(localStorage.getItem("accessToken"));
      // router.push("/");
    }

    localStorage.setItem("accessToken", params.get("access-token") as string);
    localStorage.setItem("refreshToken", params.get("refresh-token") as string);
    setIsToken(true);
  }, [isToken]);

  return <div></div>;
};

export default Page;