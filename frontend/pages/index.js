
import React, { Suspense } from 'react';
import useAuth, { AuthProvider } from "../contexts/authContext";

import Home from "../components/main/Home";
import News, {Skeleton as NewsSkeleton} from "../components/News";
import Supporters, {Skeleton as SupportersSkeleton} from "../components/Supporters";

function App() {
  const {user, loading, error} = useAuth();
  
  return (
    <div className="page-container">
      {/* <FriendsList /> Maybe? */}
      <Home />
      <NewsSkeleton />

      <Supporters />    


    </div>
  )
}

export default App;
