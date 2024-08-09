import { defineConfig } from 'vocs';

// console.log('Loading Vocs config...')

export default defineConfig({
   head: () => {
      // console.log(`Generating head content... ${new Date().toISOString()}`)
      return (
        <>
          <script
            src="https://plausible.io/js/script.js"
            data-domain="docs.xmtp.org"
            defer
          />
        </>
      )
    },
   "title":"XMTP Documentation",
   description: 'Documentation for XMTP, the open and secure messaging protocol for web3',
   editLink: {
      pattern: 'https://github.com/xmtp/docs-xmtp-org/edit/main/docs/pages/:path',
      text: 'Suggest changes to this page',
   },
   logoUrl: { 
      light: '/logomark-dark-purple.png', 
      dark: '/logomark-light-purple.png'
    },
   iconUrl: '/x-mark-blue.png', 
   topNav: [ 
      {text: 'Converse app', link: 'https://github.com/ephemeraHQ/converse-app'},
      {text: 'XMTP.org', link: 'https://xmtp.org/'},
   ],
   ogImageUrl: {
      '/': '/xmtp-og-card.jpeg',
      '/docs': 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
    },
   socials: [
      {
         icon: 'discord',
         link: 'https://discord.gg/xmtp',
      },
      {
      icon: 'github',
      link: 'https://github.com/xmtp',
      },
    ],
   "sidebar":[
     {
        "text":"Get started",
        "collapsed":false,
        "items":[
           {
              "text":"Intro to XMTP",
              "link":"/"
           },
           {
              "text":"Developer quickstart",
              "link":"/get-started/developer-quickstart"
           },
           {
              "text":"SDKs and example apps",
              "link":"/get-started/examples"
           },
           {
              "text":"SDK references",
              "link":"/get-started/references"
           },
           {
              "text":"FAQ",
              "link":"/get-started/faq"
           }
        ]
     },
     {
        "text":"Build 1:1 chat",
        "collapsed":false,
        "items":[
           {
              "text":"Create a client",
              "link":"/dms/client"
           },
           {
              "text":"Create a conversation",
              "link":"/dms/conversations"
           },
           {
              "text":"Send messages",
              "link":"/dms/messages"
           },
           {
              "text":"Stream conversations & messages",
              "link":"/dms/streams"
           },
           {
              "text":"Troubleshoot",
              "link":"/dms/troubleshoot"
           },
        ]
     },
     {
        "text":"Build group chat",
        "collapsed":false,
        "items":[
            {
              "text":"Build group chat",
              "link":"/groups/build-group-chat"
            },
            {
               "text":"Handle group consent",
               "link":"/groups/group-consent"
             },
             {
               "text":"Handle group permissions",
               "link":"/groups/group-permissions"
             },
             {
               "text":"Handle group metadata",
               "link":"/groups/group-metadata"
             },
           ]
     },
     {
        "text":"Support user consent",
        "collapsed":false,
        "items":[
            {
               "text":"Understand user consent",
               "link":"/consent/user-consent"
            },
            {
               "text":"Build with consent methods",
               "link":"/consent/consent-methods"
            },
            {
               "text":"Add consent to existing JS app",
               "link":"/consent/consent-js"
            },
            {
               "text":"Add consent to existing RN app",
               "link":"/consent/consent-rn"
            },
            {
               "text":"Filter spam",
               "link":"/consent/filter-spam"
            },
            {
               "text":"Enable subscriptions",
               "link":"/consent/subscribe"
            },
            {
               "text":"Send broadcast messages",
               "link":"/consent/broadcast"
            },
            {
               "text":"Build a consent management system",
               "link":"/consent/consent-management"
            },
        ]
     },
     {
        "text":"Support content types",
        "collapsed": false,
        "items":[
            {
               "text":"Understand content types",
               "link":"/content-types/content-types"
            },
            {
               "text":"Remote attachment",
               "link":"/content-types/remote-attachment"
            },
         {
            "text":"Replies",
            "link":"/content-types/reply"
         },
         {
            "text":"Reactions",
            "link":"/content-types/reaction"
         },
         {
            "text":"Read receipts",
            "link":"/content-types/read-receipt"
         },
         {
            "text":"Onchain transaction references",
            "link":"/content-types/transaction-ref"
         },
         {
            "text":"Custom content type",
            "link":"/content-types/custom"
         },
        ]
     },
     {
        "text":"Push notifications",
        "collapsed":false,
        "items":[
           {
            "text":"Build notifications",
            "link":"/notifications/build-notifications"
           },
           {
            "text":"Set up a notification server",
            "link":"/notifications/notif-server"
           },
           {
            "text":"Best practices",
            "link":"/notifications/notif-best-practices"
           },
           {
              "text":"Try Android example notifications",
              "link":"/notifications/notifs-android"
           },
           {
              "text":"Try iOS example notifications",
              "link":"/notifications/notifs-ios"
           },
        ]
     },
     {
      "text":"Performance & UX",
      "collapsed":false,
      "items":[
         {
            "text":"Use local-first architecture",
            "link":"/perf-ux/local-first"
         },
         {
            "text":"Use optimistic sending",
            "link":"/perf-ux/optimistic-sending"
         },
         {
            "text":"Resolve identities",
            "link":"/perf-ux/identity-resolution"
         },
         {
            "text":"Performance test",
            "link":"/perf-ux/debug-and-test"
         },
         {
            "text":"Launch checklist",
            "link":"/perf-ux/get-featured"
         },
         {
            "text":"MetaMask Snap",
            "link":"/perf-ux/xmtp-metamask-snap"
         },
       ],
     },
{
         "text":"Display Open Frames",
         "collapsed":false,
         "items":[
            {
               "text":"Get started with Open Frames",
               "link":"/open-frames/open-frames"
            },
            {
               "text":"Display transactional Open Frames",
               "link":"/open-frames/transactional-open-frames"
            },
            {
               "text":"Display subscription Open Frames",
               "link":"/open-frames/subscription-open-frames"
            },
         ],
      },  
      {
        "text":"Protocol concepts",
        "collapsed":false,
        "items":[
           {
              "text":"XMTP versions",
              "link":"/protocol/xmtp-versions"
           },
           {
              "text":"Portable inbox",
              "link":"/protocol/portable-inbox"
           },
           {
              "text":"Account signatures",
              "link":"/protocol/signatures"
           },
           {
              "text":"XIPs",
              "link":"/protocol/xips"
           },
           {
              "text":"XMTP V3",
              "collapsed":false,
              "items":[
               {
                  "text":"Group chat",
                  "link":"/protocol/v3/group-chat"
               },
               {
                  "text":"Multi-wallet identity",
                  "link":"/protocol/v3/identity"
               },
               {
                  "text":"Message history",
                  "link":"/protocol/v3/message-history"
               },
               {
                  "text":"Smart wallet support",
                  "link":"/protocol/v3/smart-wallet"
               }
              ]
           },
           {
              "text":"XMTP V2",
              "collapsed":false,
              "items":[
                 {
                    "text":"Architecture",
                    "link":"/protocol/v2/architectural-overview"
                 },
                 {
                    "text":"Key generation",
                    "link":"/protocol/v2/key-generation-and-usage"
                 },
                 {
                    "text":"Encryption",
                    "link":"/protocol/v2/invitation-and-message-encryption"
                 },
                 {
                    "text":"Algorithms in use",
                    "link":"/protocol/v2/algorithms-in-use"
                 }
              ]
           }
        ]
     },
  ]
})