/*

groups/
   $groupId/
    createdAt: number
    createdBy: string
    id: string
    members/
      $memberUid: true
    name: string
    films/
       $filmId/
         title: "Blade Runner"
         tmdbId: 78
         posterUrl: "https://image.tmdb.org/t/p/w500/..."
         addedBy: "user123"
         addedAt: 1710000000000

         ratings/
           $user1: 9
           $user2: 7

         seen/
           $user1: true

         comments/
           $cmt001/
             uid: "user456"
             text: "One of my favorites."
             timestamp: 1710000005000
     



*/
