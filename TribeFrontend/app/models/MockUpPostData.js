const getRandomPicsumUrl = () => `https://picsum.photos/seed/${Math.random().toString(36).substr(2, 9)}/200/300`;

const MockUpPostData = [
  {
    postId: "post_001",
    userId: "user_123",
    description: "A beautiful sunset over the mountains.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: -34.6037,
      longitude: -58.3816
    },
    likes: 150,
    lastComment: {
      id: "comment_456",
      userId: "user_789",
      postId: "post_123",
      comment: "Stunning view!",
      createdAt: 1633036800,
      updatedAt: 1633036800,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 10,
    createdAt: 1633036800,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_002",
    userId: "user_456",
    description: "Delicious homemade pizza!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    likes: 200,
    lastComment: {
      id: "comment_789",
      userId: "user_123",
      postId: "post_456",
      comment: "Looks yummy!",
      createdAt: 1633123200,
      updatedAt: 1633123200,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 15,
    createdAt: 1633123200,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_003",
    userId: "user_001",
    description: "A day at the beach.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 36.7783,
      longitude: -119.4179
    },
    likes: 120,
    lastComment: {
      id: "comment_001",
      userId: "user_002",
      postId: "post_001",
      comment: "Wish I was there!",
      createdAt: 1633036800,
      updatedAt: 1633036800,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 8,
    createdAt: 1633036800,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_004",
    userId: "user_002",
    description: "Hiking adventure.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    likes: 95,
    lastComment: {
      id: "comment_002",
      userId: "user_003",
      postId: "post_002",
      comment: "Looks amazing!",
      createdAt: 1633123200,
      updatedAt: 1633123200,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 5,
    createdAt: 1633123200,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_005",
    userId: "user_003",
    description: "City skyline at night.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 51.5074,
      longitude: -0.1278
    },
    likes: 180,
    lastComment: {
      id: "comment_003",
      userId: "user_001",
      postId: "post_003",
      comment: "Beautiful lights!",
      createdAt: 1633209600,
      updatedAt: 1633209600,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 12,
    createdAt: 1633209600,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_006",
    userId: "user_004",
    description: "Snowy mountains.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 46.6034,
      longitude: 1.8883
    },
    likes: 210,
    lastComment: {
      id: "comment_004",
      userId: "user_005",
      postId: "post_004",
      comment: "So serene!",
      createdAt: 1633296000,
      updatedAt: 1633296000,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 20,
    createdAt: 1633296000,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_007",
    userId: "user_005",
    description: "Delicious breakfast.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    likes: 130,
    lastComment: {
      id: "comment_005",
      userId: "user_004",
      postId: "post_005",
      comment: "Yummy!",
      createdAt: 1633382400,
      updatedAt: 1633382400,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 7,
    createdAt: 1633382400,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_008",
    userId: "user_006",
    description: "Concert night.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 40.7306,
      longitude: -73.9352
    },
    likes: 175,
    lastComment: {
      id: "comment_006",
      userId: "user_007",
      postId: "post_006",
      comment: "Rock on!",
      createdAt: 1633468800,
      updatedAt: 1633468800,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 14,
    createdAt: 1633468800,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_009",
    userId: "user_007",
    description: "Art gallery visit.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 35.6895,
      longitude: 139.6917
    },
    likes: 85,
    lastComment: {
      id: "comment_007",
      userId: "user_006",
      postId: "post_007",
      comment: "Inspiring!",
      createdAt: 1633555200,
      updatedAt: 1633555200,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 4,
    createdAt: 1633555200,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_010",
    userId: "user_008",
    description: "Camping under the stars.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    likes: 140,
    lastComment: {
      id: "comment_008",
      userId: "user_009",
      postId: "post_008",
      comment: "Looks cozy!",
      createdAt: 1633641600,
      updatedAt: 1633641600,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 9,
    createdAt: 1633641600,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_011",
    userId: "user_009",
    description: "Street food festival.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 52.5200,
      longitude: 13.4050
    },
    likes: 160,
    lastComment: {
      id: "comment_009",
      userId: "user_008",
      postId: "post_009",
      comment: "So much fun!",
      createdAt: 1633728000,
      updatedAt: 1633728000,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 11,
    createdAt: 1633728000,
    userProfilePicture: getRandomPicsumUrl()
  },
  {
    postId: "post_012",
    userId: "user_010",
    description: "Sunrise yoga session.",
    multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
    location: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    likes: 110,
    lastComment: {
      id: "comment_010",
      userId: "user_011",
      postId: "post_010",
      comment: "So peaceful!",
      createdAt: 1633814400,
      updatedAt: 1633814400,
      userProfilePicture: getRandomPicsumUrl()
    },
    numberOfComments: 6,
    createdAt: 1633814400,
    userProfilePicture: getRandomPicsumUrl()
  }
];

export default MockUpPostData;
