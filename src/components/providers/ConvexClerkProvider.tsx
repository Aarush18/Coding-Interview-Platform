"use client"

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import {ConvexReactClient} from 'convex/react';
import {ConvexProviderWithClerk} from "convex/react-clerk"
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useEffect } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function UserSync() {
  const { isSignedIn } = useAuth(); // this is more reliable
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!isSignedIn || !user || !isLoaded) return;

    const syncUserToConvex = async () => {
      try {
        await syncUser({
          clerkId: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          image: user.imageUrl,
        });
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    };

    syncUserToConvex();
  }, [isSignedIn, user, isLoaded, syncUser]);

  return null;
}


function ConvexClerkProvider({children} : {children: React.ReactNode}) {
    return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
    );
}

export default ConvexClerkProvider;