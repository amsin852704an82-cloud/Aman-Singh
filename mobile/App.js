import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  Dimensions,
  StatusBar,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'reels' | 'create'
  
  // 1. Posts Data for Profile 3x3 Grid
  const [posts, setPosts] = useState([
    { 
      id: '1', 
      uri: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&q=80', 
      views: '14.2K', 
      caption: 'WAP-7 Express Crossing at High Speed 🚆⚡' 
    },
    { 
      id: '2', 
      uri: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=500&q=80', 
      views: '13.5K', 
      caption: 'मंज़िल से बेहतर लगने लगे हैं ये रास्ते... ❤️🛤️' 
    },
    { 
      id: '3', 
      uri: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=500&q=80', 
      views: '18.1K', 
      caption: 'Struggle to Success 🔥 Indian Railway Track' 
    },
    { 
      id: '4', 
      uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=500&q=80', 
      views: '9.8K', 
      caption: 'Vande Bharat Express 130 km/h trial 🇮🇳' 
    },
    { 
      id: '5', 
      uri: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&q=80', 
      views: '24.5K', 
      caption: 'रेल की पटरी और दिल की धड़कन ❤️' 
    },
    { 
      id: '6', 
      uri: 'https://images.unsplash.com/photo-1520690214124-2405c5217036?w=500&q=80', 
      views: '7.3K', 
      caption: 'Sunset at Railway Station 🌅' 
    }
  ]);

  // 2. Reels Data (Railway Shayar Fullscreen Reels Style)
  const [reelsList, setReelsList] = useState([
    { 
      id: 'r1', 
      uri: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80', 
      user: 'railway_shayar_aman', 
      caption: '🚆 मंज़िल मिलेगी भटक कर ही सही, गुमराह तो वो हैं जो घर से निकले ही नहीं... #train #railway', 
      likes: 1240,
      isLiked: false,
      comments: '84' 
    },
    { 
      id: 'r2', 
      uri: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=800&q=80', 
      user: 'railway_shayar_aman', 
      caption: '🔥 Struggle से Success तक का सफर... लोहे की पटरी भी झुकती है जब हौसला बुलंद हो! #motivation', 
      likes: 3410,
      isLiked: true,
      comments: '192' 
    },
    { 
      id: 'r3', 
      uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&q=80', 
      user: 'railway_shayar_aman', 
      caption: '⚡ 130 Kmph Vande Bharat Express Whistle & Speed! भारतीय रेल की शान 🇮🇳 #vandebharat', 
      likes: 5820,
      isLiked: false,
      comments: '340' 
    }
  ]);

  const [imageUrl, setImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  // Quick 1-tap photos for easy testing on mobile
  const sampleImages = [
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=500&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80'
  ];

  // Nayi post publish karne ka function
  const handleAddPost = () => {
    if (!imageUrl.trim()) {
      Alert.alert("Photo Chahiye", "Kripya photo ka URL dalein ya neeche di gayi photo par tap karein!");
      return;
    }

    const newPostItem = {
      id: Date.now().toString(),
      uri: imageUrl.trim(),
      views: '1',
      caption: newCaption.trim() || 'Indian Railway Journey 🚆 #railway_shayar_aman'
    };

    setPosts([newPostItem, ...posts]);
    setImageUrl('');
    setNewCaption('');
    setActiveTab('grid');
    Alert.alert("Success 🚆", "Aapki post live profile grid me add ho gayi!");
  };

  // Like Reel toggle function
  const toggleReelLike = (reelId) => {
    setReelsList(reelsList.map(reel => {
      if (reel.id === reelId) {
        const nextLiked = !reel.isLiked;
        return {
          ...reel,
          isLiked: nextLiked,
          likes: nextLiked ? reel.likes + 1 : reel.likes - 1
        };
      }
      return reel;
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={activeTab === 'reels' ? 'light-content' : 'dark-content'} backgroundColor={activeTab === 'reels' ? '#000' : '#fff'} />

      {/* Top Header (Hidden on Fullscreen Reels for clean video experience) */}
      {activeTab !== 'reels' && (
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.username}>railway_shayar_aman</Text>
            <Ionicons name="checkmark-circle" size={16} color="#0095f6" style={{ marginLeft: 4 }} />
          </View>
          <TouchableOpacity onPress={() => Alert.alert("Settings", "Aapka account: railway_shayar_aman (Active)")}>
            <Ionicons name="menu-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* --- CONTENT BASED ON ACTIVE TAB --- */}
      
      {/* 1. REELS TAB (Fullscreen vertical scrolling reels) */}
      {activeTab === 'reels' ? (
        <View style={styles.reelWrapper}>
          <FlatList
            data={reelsList}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.reelContainer}>
                <Image source={{ uri: item.uri }} style={styles.reelImage} />
                
                {/* Dark Gradient Overlay at Bottom */}
                <View style={styles.reelOverlay}>
                  <View style={styles.reelInfo}>
                    <View style={styles.userRow}>
                      <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=100&q=80' }} 
                        style={styles.reelAvatar} 
                      />
                      <Text style={styles.reelUser}>@{item.user}</Text>
                      <TouchableOpacity style={styles.followBadge}>
                        <Text style={styles.followBadgeText}>Follow</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.reelCaption} numberOfLines={3}>
                      {item.caption}
                    </Text>

                    <View style={styles.audioRow}>
                      <Ionicons name="musical-notes" size={14} color="#fff" />
                      <Text style={styles.audioText}>Original Audio - Indian Railway Beats 🎶</Text>
                    </View>
                  </View>

                  {/* Right Action Icons (Like, Comment, Share) */}
                  <View style={styles.reelRightActions}>
                    <TouchableOpacity onPress={() => toggleReelLike(item.id)} style={styles.actionBtn}>
                      <Ionicons 
                        name={item.isLiked ? "heart" : "heart-outline"} 
                        size={32} 
                        color={item.isLiked ? "#ef4444" : "#ffffff"} 
                      />
                      <Text style={styles.reelActionText}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Alert.alert("Comments", `${item.comments} comments on this reel`)} style={styles.actionBtn}>
                      <Ionicons name="chatbubble-outline" size={28} color="white" />
                      <Text style={styles.reelActionText}>{item.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Alert.alert("Share", "Reel link copied to clipboard!")} style={styles.actionBtn}>
                      <Ionicons name="paper-plane-outline" size={28} color="white" />
                      <Text style={styles.reelActionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ) : activeTab === 'create' ? (
        /* 2. CREATE POST TAB */
        <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.createTitle}>Nayi Post Ya Reel Banayein 📸</Text>
          <Text style={styles.createSubtitle}>Apni train photo aur shayari yahan add karein</Text>

          <Text style={styles.inputLabel}>Photo URL / Link daalein:</Text>
          <TextInput
            style={styles.input}
            placeholder="https://... (Image URL)"
            placeholderTextColor="#aaa"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
          />

          {/* Quick Select for Mobile */}
          <Text style={styles.sampleLabel}>Ya neeche sample train photo chunein:</Text>
          <View style={styles.sampleRow}>
            {sampleImages.map((img, idx) => (
              <TouchableOpacity 
                key={idx} 
                onPress={() => setImageUrl(img)}
                style={[styles.sampleThumb, imageUrl === img && styles.sampleThumbActive]}
              >
                <Image source={{ uri: img }} style={styles.sampleThumbImg} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Image Preview */}
          {imageUrl ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>Photo Preview:</Text>
              <Image source={{ uri: imageUrl }} style={styles.previewImg} />
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Caption / Shayari likhein:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Caption likhein (e.g. मंज़िल से बेहतर लगने लगे हैं ये रास्ते...)"
            placeholderTextColor="#aaa"
            value={newCaption}
            onChangeText={setNewCaption}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.uploadButton} onPress={handleAddPost}>
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.uploadBtnText}>Post Publish Karein 🚀</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveTab('grid')}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        /* 3. PROFILE GRID TAB (Default) */
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header Stats */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrap}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=200&q=80' }} 
                style={styles.avatar} 
              />
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>11</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>following</Text>
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.bioName}>Aman | भारतीय रेल प्रेमी 🇮🇳</Text>
            <Text style={styles.bioCategory}>Reel creator</Text>
            <Text style={styles.bioText}>🚆 Indian Railway & Train Lover ❤️</Text>
            <Text style={styles.bioText}>✍️ Deep Hindi Shayari & Quotes</Text>
            <Text style={styles.bioLink}>🔗 linktr.ee/railway_shayar_aman</Text>
          </View>

          {/* Profile Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.editBtn} 
              onPress={() => Alert.alert("Profile", "Bio: Indian Railway & Train Lover ❤️")}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.shareBtn} 
              onPress={() => Alert.alert("Share", "Share your profile link: @railway_shayar_aman")}
            >
              <Text style={styles.shareBtnText}>Share Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Grid Sub-tabs */}
          <View style={styles.gridTabs}>
            <TouchableOpacity style={[styles.gridTab, styles.gridTabActive]}>
              <Ionicons name="grid" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridTab} onPress={() => setActiveTab('reels')}>
              <Ionicons name="film-outline" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridTab} onPress={() => setActiveTab('create')}>
              <Ionicons name="add-circle-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* 3x3 Grid List */}
          <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.gridItem} 
                activeOpacity={0.8}
                onPress={() => Alert.alert("Post", `${item.caption}\nViews: ${item.views}`)}
              >
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
                <View style={styles.viewsOverlay}>
                  <Ionicons name="play" size={11} color="white" />
                  <Text style={styles.viewsText}>{item.views}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, activeTab === 'reels' && styles.bottomNavDark]}>
        <TouchableOpacity onPress={() => setActiveTab('grid')} style={styles.navBtn}>
          <Ionicons 
            name="home-outline" 
            size={26} 
            color={activeTab === 'grid' ? (activeTab === 'reels' ? '#fff' : '#000') : '#94a3b8'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setActiveTab('reels')} style={styles.navBtn}>
          <Ionicons 
            name={activeTab === 'reels' ? "film" : "play-outline"} 
            size={26} 
            color={activeTab === 'reels' ? '#38bdf8' : '#94a3b8'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setActiveTab('create')} style={styles.navBtn}>
          <View style={styles.createIcon}>
            <Ionicons name="add" size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("Search", "Explore trains & hashtags")} style={styles.navBtn}>
          <Ionicons name="search-outline" size={26} color="#94a3b8 motion" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('grid')} style={styles.navBtn}>
          <View style={[styles.avatarNavBorder, activeTab === 'grid' && styles.avatarNavBorderActive]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1510519138171-eb1362e5b888?w=100&q=80' }} 
              style={styles.avatarNav} 
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 30 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },
  username: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#0f172a' 
  },
  profileSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginTop: 10 
  },
  avatarWrap: {
    position: 'relative'
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#e2e8f0' 
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff'
  },
  statsContainer: { 
    flexDirection: 'row', 
    flex: 1, 
    justifyContent: 'space-around', 
    marginLeft: 15 
  },
  statBox: { 
    alignItems: 'center' 
  },
  statNumber: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#0f172a' 
  },
  statLabel: { 
    fontSize: 13, 
    color: 'gray' 
  },
  bioSection: { 
    paddingHorizontal: 16, 
    marginTop: 10, 
    marginBottom: 12 
  },
  bioName: { 
    fontWeight: '700',
    fontSize: 15,
    color: '#0f172a'
  },
  bioCategory: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 1,
    marginBottom: 3
  },
  bioText: { 
    fontSize: 14, 
    marginTop: 2,
    color: '#334155'
  },
  bioLink: {
    fontSize: 13,
    color: '#0284c7',
    marginTop: 4,
    fontWeight: '600'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12
  },
  editBtn: {
    flex: 1,
    height: 34,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a'
  },
  shareBtn: {
    flex: 1,
    height: 34,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a'
  },
  gridTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  gridTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10
  },
  gridTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a'
  },
  gridItem: { 
    flex: 1/3, 
    aspectRatio: 1, 
    padding: 1, 
    position: 'relative' 
  },
  gridImage: { 
    width: '100%', 
    height: '100%' 
  },
  viewsOverlay: { 
    position: 'absolute', 
    bottom: 5, 
    left: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  viewsText: { 
    color: 'white', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },

  /* Reel Styles */
  reelWrapper: {
    flex: 1,
    backgroundColor: '#000'
  },
  reelContainer: { 
    width: SCREEN_WIDTH, 
    height: SCREEN_HEIGHT - 110, 
    backgroundColor: '#000', 
    position: 'relative', 
    justifyContent: 'flex-end' 
  },
  reelImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute' 
  },
  reelOverlay: { 
    padding: 16, 
    paddingBottom: 24,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.35)' 
  },
  reelInfo: {
    flex: 1,
    paddingRight: 12
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  reelAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fff'
  },
  reelUser: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  followBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)'
  },
  followBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  reelCaption: { 
    color: 'white', 
    fontSize: 14, 
    lineHeight: 20
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8
  },
  audioText: {
    color: '#e2e8f0',
    fontSize: 12
  },
  reelRightActions: { 
    alignItems: 'center', 
    marginBottom: 8 
  },
  actionBtn: {
    alignItems: 'center',
    marginTop: 18
  },
  reelActionText: { 
    color: 'white', 
    fontSize: 12, 
    marginTop: 4,
    fontWeight: '600' 
  },

  /* Create Post Styles */
  createContainer: { 
    flex: 1, 
    padding: 18 
  },
  createTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  createSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6
  },
  input: { 
    width: '100%', 
    height: 48, 
    backgroundColor: '#f8fafc', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    marginBottom: 14,
    fontSize: 14,
    color: '#0f172a'
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top'
  },
  sampleLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8
  },
  sampleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  sampleThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  sampleThumbActive: {
    borderColor: '#0095f6'
  },
  sampleThumbImg: {
    width: '100%',
    height: '100%'
  },
  previewBox: {
    marginBottom: 14
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4
  },
  previewImg: {
    width: '100%',
    height: 180,
    borderRadius: 8
  },
  uploadButton: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#0095f6', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8, 
    marginTop: 4 
  },
  uploadBtnText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  cancelBtn: {
    width: '100%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600'
  },

  /* Bottom Navigation Styles */
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 8, 
    borderTopWidth: 0.5, 
    borderColor: '#e2e8f0', 
    backgroundColor: '#fff' 
  },
  bottomNavDark: {
    backgroundColor: '#0a0a0a',
    borderColor: '#222'
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6
  },
  createIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarNavBorder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden'
  },
  avatarNavBorderActive: {
    borderColor: '#0f172a'
  },
  avatarNav: {
    width: '100%',
    height: '100%'
  }
});
