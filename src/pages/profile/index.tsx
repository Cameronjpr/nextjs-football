import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Status } from "../../account/types";
import { useRouter } from "next/router";
import axios from "axios";
import { User } from "@prisma/client";
import { teams } from "../../data/teams";
import Image from "next/image";
import Head from "next/head";

const Profile = ({ user }: { user: User }) => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "You");
  const [tempUsername, setTempUsername] = useState(username);
  const [userInfo, setUserInfo] = useState<any>(undefined);

  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      if (session?.user?.email === null) return;
      const userInfo = await axios.get("/api/profile");

      setUserInfo(userInfo?.data);
      setTempUsername(userInfo?.data?.username);
    };

    getUserInfo();
  }, [session]);

  if (status === Status.Unauthenticated) {
    router.push(
      encodeURI("/login?message=You must be signed in to view this page.")
    );
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  };

  const updateProfile = async () => {
    const res = await axios
      .post("/api/profile/update", {
        username: tempUsername,
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const EditButton = () => {
    return isEditing ? (
      <button
        className="sm:text-md w-16 rounded-md text-slate-700 sm:h-20 sm:w-20 sm:p-3"
        onClick={() => {
          setUsername(tempUsername);
          setIsEditing(false);
          updateProfile();
        }}
      >
        Done
      </button>
    ) : (
      <button
        className="sm:text-md w-16 rounded-md text-slate-700 sm:h-20 sm:w-20 sm:p-3"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    );
  };

  const UsernameField = () => {
    return isEditing ? (
      <input
        type="text"
        className="ml-5 w-full rounded-md p-2 text-xl sm:text-2xl"
        value={tempUsername}
        onChange={(e) => setTempUsername(e.target.value)}
      ></input>
    ) : (
      <h1 className="ml-5 w-full p-2 text-xl sm:text-2xl">
        {userInfo?.username}
      </h1>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Profile - Soccer Survivor</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <div className="flex w-full flex-col place-content-center">
        <main className="">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col gap-1"
          >
            <div className="flex w-full place-content-between rounded-md bg-slate-100 p-5">
              <>
                {/* Refactor these two sections, they're almost identical */}
                <div className="flex w-full flex-row place-content-between gap-5">
                  <div className="flex w-full flex-row items-center">
                    {session?.user?.image && (
                      <Image
                        src={session?.user?.image || ""}
                        alt={`The player ${session?.user?.name}`}
                        quality={80}
                        width="80"
                        height="80"
                        className="h-16 w-16 rounded-md p-2 sm:h-20 sm:w-20 sm:p-3"
                      />
                    )}
                    {<UsernameField />}
                  </div>
                  <div className="flex flex-row place-content-end">
                    {<EditButton />}
                  </div>
                </div>
              </>
            </div>
            <section className="p-5">
              <h2 className="mb-2 text-xl">Your selection</h2>
              {userInfo?.selection && (
                <p>
                  You have selected{" "}
                  <strong className="font-semibold">
                    {teams[Number(userInfo?.selection)]}
                  </strong>
                  .
                </p>
              )}
            </section>
          </motion.div>
        </main>
      </div>
    </Layout>
  );
};

export default Profile;
