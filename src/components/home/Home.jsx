import React from 'react';
import TopHeader from './TopHeader';
import StoryBar from './StoryBar';
import PostCard from './PostCard';
import BottomNav from './BottomNav';

const mockPosts = [
  {
    id: 'post-1',
    user: {
      name: 'aarav_sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      location: 'Varanasi, Uttar Pradesh',
    },
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    caption: 'Ganga Aarti at Dashashwamedh Ghat. The spiritual energy of Bharat is truly unmatched! ✨🪔 #Varanasi #IncredibleIndia',
    likesCount: 1420,
    timeAgo: '2 hours ago',
  },
  {
    id: 'post-2',
    user: {
      name: 'priya.patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      location: 'Udaipur, Rajasthan',
    },
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunset over Lake Pichola. Golden hour in the City of Lakes hits differently. 🏰🌅 #RajasthanDiaries #BharatTravel',
    likesCount: 2890,
    timeAgo: '4 hours ago',
  },
  {
    id: 'post-3',
    user: {
      name: 'rohan_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      location: 'Koramangala, Bengaluru',
    },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Building BharatConnect for 1.4 Billion citizens! Late night chai & code sessions with the founding team. 💻☕🇮🇳 #StartupIndia #MakeInIndia',
    likesCount: 954,
    timeAgo: '6 hours ago',
  },
  {
    id: 'post-4',
    user: {
      name: 'ananya_dance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      location: 'Chennai, Tamil Nadu',
    },
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    caption: 'Margazhi season classical rehearsals in full swing! Connecting traditional roots with modern Bharat. 💃✨ #Bharatanatyam #IndianClassical',
    likesCount: 3120,
    timeAgo: '8 hours ago',
  },
];

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center">
      {/* Mobile-first centered feed container */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 border-x border-slate-900 flex flex-col relative pb-20 shadow-2xl">
        {/* 1. Sticky Header */}
        <TopHeader />

        {/* 2. Instagram-style Story Bar */}
        <StoryBar />

        {/* 3. Main Post Feed */}
        <main className="flex-1 divide-y divide-slate-900">
          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
              user={post.user}
              image={post.image}
              caption={post.caption}
              likesCount={post.likesCount}
              timeAgo={post.timeAgo}
            />
          ))}
        </main>

        {/* 4. Fixed Bottom Navigation Bar */}
        <BottomNav activeTab="home" />
      </div>
    </div>
  );
};

export default Home;
