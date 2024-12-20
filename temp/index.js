const bookTestData = [
  {
      "upload_id": "efd771f9-7a46-413f-906a-4f2e30dacaba",
      "book_id": "625603",
      "title": "Horus Rising (The Horus Heresy, #1)",
      "author": "Dan Abnett",
      "dimensions": "4.1 x 1 x 6.75",
      "domColor": "#474641",
      "fileName": "horus_rising-9781844162949.png",
      "genre": "",
      "isbn": "184416294X",
      "isbn13": null,
      "pubDate": "2006",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 11 Feb 2021 00:00:00 +0000",
      "average_rating": "4.22",
      "user_rating": "3"
  },
  {
      "upload_id": "29acbd13-6cc8-496f-960b-5e13e7304a6e",
      "book_id": "32320324",
      "title": "The Business Ethics Field Guide: The Essential Companion to Leading Your Career and Your Company to Greatness",
      "author": "Aaron Miller Bill O'Rourke Brad Agle",
      "dimensions": "7x.7x8.2",
      "domColor": "#f49e2c",
      "fileName": "business_ethics_field_guide-9780991091034.JPG",
      "genre": "",
      "isbn": "0991091035",
      "isbn13": "9780991091034",
      "pubDate": "",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 18 Apr 2021 00:00:00 +0000",
      "average_rating": "3.95",
      "user_rating": "4"
  },
  {
      "upload_id": "3f0edf88-4612-4ebb-a4a3-fe12a5d2a04d",
      "book_id": "38447",
      "title": "The Handmaid’s Tale (The Handmaid's Tale, #1)",
      "author": "Margaret Atwood",
      "dimensions": "5.21 x 0.7 x 7.94",
      "domColor": "#d75043",
      "fileName": "handmaids_tale-9780385490818.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "1985",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 22 May 2021 00:00:00 +0000",
      "average_rating": "4.15",
      "user_rating": "3"
  },
  {
      "upload_id": "34e49b92-c7db-4a9e-87d5-0dffa10d1c25",
      "book_id": "50935234",
      "title": "Alice Knott",
      "author": "Blake Butler",
      "dimensions": "6.15x1.08x9.26",
      "domColor": "#252838",
      "fileName": "alice_knott-9780525535218.png",
      "genre": "",
      "isbn": "0525535233",
      "isbn13": "9780525535232",
      "pubDate": "2020",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 3 Jan 2021 00:00:00 +0000",
      "average_rating": "3.47",
      "user_rating": "3"
  },
  {
      "upload_id": "aaaab441-f0c2-4f91-9f49-5d563fe163e5",
      "book_id": "149181",
      "title": "Klee Wyck",
      "author": "Emily Carr",
      "dimensions": "5.5 x 0.95 x 8.25",
      "domColor": "#a65e35",
      "fileName": "klee_wyck-9781553650270.png",
      "genre": "",
      "isbn": "1553650255",
      "isbn13": "9781553650256",
      "pubDate": "1941",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 12 May 2021 00:00:00 +0000",
      "average_rating": "3.92",
      "user_rating": "3"
  },
  {
      "upload_id": "c10969e7-cc69-433e-b6b0-792ed601bc6d",
      "book_id": "856250",
      "title": "The Awakening and Selected Stories of Kate Chopin",
      "author": "Kate Chopin",
      "dimensions": "4.25 x 0.91 x 6.81",
      "domColor": "#c5b594",
      "fileName": "awakening-9780451524485.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "1899",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 30 Dec 2021 00:00:00 +0000",
      "average_rating": "3.79",
      "user_rating": "4"
  },
  {
      "upload_id": "45a4869c-fc98-4dae-b890-933a3ce84821",
      "book_id": "815091",
      "title": "Galaxy in Flames (The Horus Heresy, #3)",
      "author": "Ben Counter",
      "dimensions": "4.19 x 1.1 x 6.75",
      "domColor": "#4f4f48",
      "fileName": "galaxy_in_flames-9781844163939.png",
      "genre": "",
      "isbn": "1844163938",
      "isbn13": "9781844163939",
      "pubDate": "2006",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Tue, 27 Apr 2021 00:00:00 +0000",
      "average_rating": "4.12",
      "user_rating": "4"
  },
  {
      "upload_id": "9f20f62f-6973-49d9-8609-b1916070677e",
      "book_id": "455373",
      "title": "Sphere",
      "author": "Michael Crichton",
      "dimensions": "1 x 5.2 x 7.9",
      "domColor": "#141411",
      "fileName": "sphere-9780062428868.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "1987",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 12 May 2021 00:00:00 +0000",
      "average_rating": "3.83",
      "user_rating": "3"
  },
  {
      "upload_id": "3a1214af-037b-4456-aa55-82bb1d3c430a",
      "book_id": "27833670",
      "title": "Dark Matter",
      "author": "Blake Crouch",
      "dimensions": "6.35x1.2x9.5",
      "domColor": "#ef7b54",
      "fileName": "dark_matter-9781101904220.png",
      "genre": "",
      "isbn": "1101904224",
      "isbn13": "9781101904220",
      "pubDate": "2016",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 6 Jan 2021 00:00:00 +0000",
      "average_rating": "4.13",
      "user_rating": "4"
  },
  {
      "upload_id": "39911990-2bae-4ae2-b5b3-d42279ab8f97",
      "book_id": "57423646",
      "title": "Immune: a Journey into the Mysterious System that Keeps You Alive",
      "author": "Philipp Dettmer",
      "dimensions": "7.32 x 1.42 x 9.29",
      "domColor": "#63213a",
      "fileName": "immune-9780593241318.png",
      "genre": "",
      "isbn": "0593241312",
      "isbn13": "9780593241318",
      "pubDate": "2021",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 24 Dec 2021 00:00:00 +0000",
      "average_rating": "4.58",
      "user_rating": "5"
  },
  {
      "upload_id": "c05efe94-5f02-4833-a8f4-50d22448533c",
      "book_id": "22608",
      "title": "VALIS",
      "author": "Philip K. Dick",
      "dimensions": "4.25 x 6.87 x .6",
      "domColor": "#746532",
      "fileName": "valis-9780552118415.png",
      "genre": "",
      "isbn": "0552118419",
      "isbn13": "9780552118415",
      "pubDate": "1981",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 7 Jul 2021 00:00:00 +0000",
      "average_rating": "3.85",
      "user_rating": "3"
  },
  {
      "upload_id": "5c59d77a-eebb-455e-b2e2-64e9a515f4ab",
      "book_id": "54620797",
      "title": "A Tale of Two Cities",
      "author": "Charles Dickens",
      "dimensions": "8.75 x 4.88 x 1.38",
      "domColor": "#c7c2b3",
      "fileName": "tale_of_two_cities-9781774021705.jpg",
      "genre": "",
      "isbn": "1774021706",
      "isbn13": "9781774021705",
      "pubDate": "1859",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Tue, 13 Jul 2021 00:00:00 +0000",
      "average_rating": "3.93",
      "user_rating": "4"
  },
  {
      "upload_id": "57632b92-2c2a-4072-a2c8-1ab5a6cab1bd",
      "book_id": "13539171",
      "title": "Pirate Cinema",
      "author": "Cory Doctorow",
      "dimensions": "5.81 x 1.29 x 8.7",
      "domColor": "#6f665e",
      "fileName": "pirate_cinema-9780765329080.png",
      "genre": "",
      "isbn": "0765329085",
      "isbn13": "9780765329080",
      "pubDate": "2012",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 14 Jan 2021 00:00:00 +0000",
      "average_rating": "3.72",
      "user_rating": "2"
  },
  {
      "upload_id": "33b8dabf-ff43-4167-b9aa-658c1e0070f3",
      "book_id": "34914739",
      "title": "I Am Watching You",
      "author": "Teresa Driscoll",
      "dimensions": "5.5 x 1 x 8.25",
      "domColor": "#9eb0b3",
      "fileName": "i_am_watching_you-9781542046596.png",
      "genre": "",
      "isbn": "1542096596",
      "isbn13": "9781542096591",
      "pubDate": "2017",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Tue, 25 May 2021 00:00:00 +0000",
      "average_rating": "4.03",
      "user_rating": "3"
  },
  {
      "upload_id": "189dbca1-1a4d-48e3-9cae-d248c143cbdd",
      "book_id": "25663542",
      "title": "Silence",
      "author": "Shūsaku Endō",
      "dimensions": "5.44 x 0.72 x 8.25",
      "domColor": "#181710",
      "fileName": "silence-9781250082275.png",
      "genre": "",
      "isbn": "1250082277",
      "isbn13": "9781250082275",
      "pubDate": "1966",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 27 Dec 2021 00:00:00 +0000",
      "average_rating": "4.03",
      "user_rating": "5"
  },
  {
      "upload_id": "8d5fda01-dfe1-498f-b11a-c5f3c45342a5",
      "book_id": "57584081",
      "title": "Mysteries of the First Instant: Illuminating What Science Hasn’t Answered about the Inception of Our Universe (Origins)",
      "author": "Daniel Friedmann",
      "dimensions": "6 x 0.87 x 9",
      "domColor": "#2c3b83",
      "fileName": "mysteries_of_the_first_instant-9781689226691.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 17 Apr 2021 00:00:00 +0000",
      "average_rating": "3.42",
      "user_rating": "3"
  },
  {
      "upload_id": "025cf225-63f5-48d9-b977-cb5cca2fc6f6",
      "book_id": "1041865",
      "title": "The Spire",
      "author": "William Golding",
      "dimensions": "6 x 1.2 x 7",
      "domColor": "#c3ac85",
      "fileName": "spire.png",
      "genre": "",
      "isbn": "0571225462",
      "isbn13": "9780571225460",
      "pubDate": "1964",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 9 May 2021 00:00:00 +0000",
      "average_rating": "3.53",
      "user_rating": "3"
  },
  {
      "upload_id": "59ef61ad-50e9-442b-b22d-79301ca71301",
      "book_id": "36538793",
      "title": "Demon Slayer: Kimetsu no Yaiba, Vol. 1",
      "author": "Koyoharu Gotouge",
      "dimensions": "5 x 0.7 x 7.5",
      "domColor": "#4c3d3d",
      "fileName": "demon_slayer_one-9781974700523.png",
      "genre": "",
      "isbn": "1974700526",
      "isbn13": "9781974700523",
      "pubDate": "2016",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 17 May 2021 00:00:00 +0000",
      "average_rating": "4.39",
      "user_rating": "3"
  },
  {
      "upload_id": "ba63c32c-71aa-411e-9417-a823fcb5ee28",
      "book_id": "2165",
      "title": "The Old Man and the Sea",
      "author": "Ernest Hemingway",
      "dimensions": "6.13 x 1 x 7",
      "domColor": "#add195",
      "fileName": "old_man_and_the_sea-9780684830490.jpg",
      "genre": "",
      "isbn": "0684830493",
      "isbn13": "9780684830490",
      "pubDate": "1952",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 23 Dec 2021 00:00:00 +0000",
      "average_rating": "3.81",
      "user_rating": "4"
  },
  {
      "upload_id": "619969ed-51f5-4aa0-9a19-191797985758",
      "book_id": "128029",
      "title": "A Thousand Splendid Suns",
      "author": "Khaled Hosseini",
      "dimensions": "6.32 x 1.26 x 9.29",
      "domColor": "#dcd38f",
      "fileName": "thousand_splendid_suns-9781594489501.png",
      "genre": "",
      "isbn": "1594489505",
      "isbn13": "9781594489501",
      "pubDate": "2007",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 18 Mar 2021 00:00:00 +0000",
      "average_rating": "4.43",
      "user_rating": "4"
  },
  {
      "upload_id": "b7a3b4f7-e338-4033-848b-340cb5fa8754",
      "book_id": "17837762",
      "title": "Uzumaki",
      "author": "Junji Ito",
      "dimensions": "5.75 x 1.9 x 8.25",
      "domColor": "#9f9f9b",
      "fileName": "uzumaki-9781421561325.png",
      "genre": "",
      "isbn": "1421561328",
      "isbn13": "9781421561325",
      "pubDate": "2000",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 8 Jan 2021 00:00:00 +0000",
      "average_rating": "4.45",
      "user_rating": "4"
  },
  {
      "upload_id": "6a874276-3152-4a5b-8f23-bbe321d8abf2",
      "book_id": "168646",
      "title": "Slaughterhouse-Five",
      "author": "Kurt Vonnegut Jr.",
      "dimensions": "5.3 x 0.6 x 8",
      "domColor": "#dfba3d",
      "fileName": "slaughterhouse_five-9780440180296.png",
      "genre": "",
      "isbn": "0440180295",
      "isbn13": "9780440180296",
      "pubDate": "1969",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 1 Jan 2021 00:00:00 +0000",
      "average_rating": "4.08",
      "user_rating": "4"
  },
  {
      "upload_id": "3940bdb1-612a-41b3-9635-671c0e5d6271",
      "book_id": "231599",
      "title": "Mass Effect: Revelation (Mass Effect, #1)",
      "author": "Drew Karpyshyn",
      "dimensions": "4.14 x 0.83 x 6.84",
      "domColor": "#d5a39f",
      "fileName": "masseffect_revelation-9780345498168.jpg",
      "genre": "",
      "isbn": "034549816X",
      "isbn13": null,
      "pubDate": "2007",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Tue, 19 Jan 2021 00:00:00 +0000",
      "average_rating": "3.73",
      "user_rating": "3"
  },
  {
      "upload_id": "4496055d-1865-42d8-ac3d-b8a5091ebbfc",
      "book_id": "2729221",
      "title": "Mass Effect: Ascension (Mass Effect, #2)",
      "author": "Drew Karpyshyn",
      "dimensions": "4.25 x 0.9 x 6.85",
      "domColor": "#d7a9a5",
      "fileName": "masseffect_ascension-9780345498526.jpg",
      "genre": "",
      "isbn": "0345498526",
      "isbn13": "9780345498526",
      "pubDate": "2008",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 25 Oct 2021 00:00:00 +0000",
      "average_rating": "3.74",
      "user_rating": "3"
  },
  {
      "upload_id": "553a2e12-fd5e-4b9c-b79d-660dc9fb6253",
      "book_id": "44901877",
      "title": "When You Trap a Tiger",
      "author": "Tae Keller",
      "dimensions": "5.88 x 0.99 x 8.56",
      "domColor": "#e2979d",
      "fileName": "when_you_trap_a_tiger-9781524715700.jpg",
      "genre": "",
      "isbn": "1524715700",
      "isbn13": "9781524715700",
      "pubDate": "2020",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 19 Jul 2021 00:00:00 +0000",
      "average_rating": "4.12",
      "user_rating": "4"
  },
  {
      "upload_id": "68f4e0ac-70e2-405d-a32f-03fb6db6e0cf",
      "book_id": "69571",
      "title": "Rich Dad, Poor Dad",
      "author": "Robert T. Kiyosaki",
      "dimensions": "6 x 1 x 8.75",
      "domColor": "#372d44",
      "fileName": "rich_dad_poor_dad-9781612680170.png",
      "genre": "",
      "isbn": "0751532711",
      "isbn13": "9780751532715",
      "pubDate": "1997",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 28 Jan 2021 00:00:00 +0000",
      "average_rating": "4.11",
      "user_rating": "3"
  },
  {
      "upload_id": "d6d2be8a-0966-4128-8a0e-2229bc720df0",
      "book_id": "17797381",
      "title": "Innocence",
      "author": "Dean Koontz",
      "dimensions": "6.4 x 1 x 9",
      "domColor": "#b0b2b7",
      "fileName": "innocence-9780553808032.png",
      "genre": "",
      "isbn": "0553808036",
      "isbn13": "9780553808032",
      "pubDate": "2014",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 3 Jun 2021 00:00:00 +0000",
      "average_rating": "3.65",
      "user_rating": "3"
  },
  {
      "upload_id": "181000d2-d142-42a5-9bc1-f6715c8395a4",
      "book_id": "32968553",
      "title": "Vacation Guide to the Solar System: Science for the Savvy Space Traveler!",
      "author": "Olivia Koski",
      "dimensions": "5.81 x 0.71 x 7.81",
      "domColor": "#ae4217",
      "fileName": "vacation_guide_to_the_solar_system-9780143129776.png",
      "genre": "",
      "isbn": "0143129775",
      "isbn13": "9780143129776",
      "pubDate": "2017",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 21 Nov 2021 00:00:00 +0000",
      "average_rating": "3.97",
      "user_rating": "5"
  },
  {
      "upload_id": "020e8c19-fab7-40d9-b249-6bba84f2e8af",
      "book_id": "51600140",
      "title": "Sea Change",
      "author": "Nancy Kress",
      "dimensions": "5 x .7 x 8",
      "domColor": "#d5c485",
      "fileName": "sea_change-9781616963316.jpg",
      "genre": "",
      "isbn": "161696331X",
      "isbn13": null,
      "pubDate": "2020",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 31 May 2021 00:00:00 +0000",
      "average_rating": "3.55",
      "user_rating": "3"
  },
  {
      "upload_id": "e6b188ae-218a-4833-a0cc-6d650ba84153",
      "book_id": "43822104",
      "title": "The Quantum Garden (The Quantum Evolution, #2)",
      "author": "Derek Künsken",
      "dimensions": "5.06 x 1.1 x 7.81",
      "domColor": "#584d47",
      "fileName": "quantum_garden-9781781085714.png",
      "genre": "",
      "isbn": "1781085714",
      "isbn13": "9781781085714",
      "pubDate": "2019",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 21 Feb 2021 00:00:00 +0000",
      "average_rating": "4.17",
      "user_rating": "4"
  },
  {
      "upload_id": "71d73df5-7bbe-419c-bea1-df7201ec1336",
      "book_id": "16143347",
      "title": "We Were Liars",
      "author": "E. Lockhart",
      "dimensions": "5.5 x 0.84 x 8.25",
      "domColor": "#919990",
      "fileName": "we_were_liars-9780385741279.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "2014",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 23 Jan 2021 00:00:00 +0000",
      "average_rating": "3.66",
      "user_rating": "2"
  },
  {
      "upload_id": "4fb56961-ae53-45f6-bb72-1124bc686704",
      "book_id": "53939957",
      "title": "Flirtasaurus (Natural History, #1)",
      "author": "Erin  Mallon",
      "dimensions": "5.5 x 0.65 x 8.5",
      "domColor": "#253474",
      "fileName": "flirtasaurus-9798654172310.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "2020",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 24 Dec 2021 00:00:00 +0000",
      "average_rating": "3.53",
      "user_rating": "1"
  },
  {
      "upload_id": "5f34e4dc-e224-4c43-a4bb-7abc862877b5",
      "book_id": "3141122",
      "title": "Doctor Faustus and Other Plays",
      "author": "Christopher Marlowe",
      "dimensions": "7.5 x 1.4 x 5",
      "domColor": "#d5d4c5",
      "fileName": "doctor_faustus-9780199537068.jpg",
      "genre": "",
      "isbn": "0199537062",
      "isbn13": "9780199537068",
      "pubDate": "1589",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 15 Nov 2021 00:00:00 +0000",
      "average_rating": "3.73",
      "user_rating": "4"
  },
  {
      "upload_id": "344757d9-eaf3-426f-8e4d-1ff2f1d4e219",
      "book_id": "381817",
      "title": "False Gods (The Horus Heresy, #2)",
      "author": "Graham McNeill",
      "dimensions": "4.19 x 1.1 x 6.75",
      "domColor": "#525350",
      "fileName": "false_gods-9781844163700.png",
      "genre": "",
      "isbn": "1844163709",
      "isbn13": "9781844163700",
      "pubDate": "2006",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 24 Feb 2021 00:00:00 +0000",
      "average_rating": "4.10",
      "user_rating": "2"
  },
  {
      "upload_id": "33ea4eea-3a8f-46e7-9b2b-83ed750bb769",
      "book_id": "41717572",
      "title": "So You Want to Talk About Race",
      "author": "Ijeoma Oluo",
      "dimensions": "5.8 x 0.9 x 8.45",
      "domColor": "#1f6281",
      "fileName": "so_you_want_to_talk_about_race-9781580058827.png",
      "genre": "",
      "isbn": "1580058825",
      "isbn13": "9781580058827",
      "pubDate": "2018",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 27 Feb 2021 00:00:00 +0000",
      "average_rating": "4.57",
      "user_rating": "3"
  },
  {
      "upload_id": "93ece804-35c0-49fd-80cd-2771a0231aff",
      "book_id": "36809135",
      "title": "Where the Crawdads Sing",
      "author": "Delia Owens",
      "dimensions": "6.4 x 1.5 x 9.2",
      "domColor": "#e4bda7",
      "fileName": "where_the_crawdads_sing-9780735219113.png",
      "genre": "",
      "isbn": "0735219117",
      "isbn13": "9780735219113",
      "pubDate": "2018",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 9 Jun 2021 00:00:00 +0000",
      "average_rating": "4.35",
      "user_rating": "5"
  },
  {
      "upload_id": "187312ef-99de-4d46-9245-6e5bde19a005",
      "book_id": "96987",
      "title": "The Symposium (Penguin Great Ideas)",
      "author": "Plato",
      "dimensions": "4.36 x 0.34 x 7.11",
      "domColor": "#264859",
      "fileName": "symposium-9780143037538.jpg",
      "genre": "",
      "isbn": "0143037536",
      "isbn13": "9780143037538",
      "pubDate": "-380",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 29 Aug 2021 00:00:00 +0000",
      "average_rating": "3.94",
      "user_rating": "2"
  },
  {
      "upload_id": "c7816ad2-8680-47a1-8668-8378ff08e367",
      "book_id": "40605223",
      "title": "I'm Thinking of Ending Things",
      "author": "Iain Reid",
      "dimensions": "5.5 x 0.7 x 8.38",
      "domColor": "#2a2d37",
      "fileName": "im_thinking_of_ending_things-9781501126949.jpeg",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "2016",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 27 Jan 2021 00:00:00 +0000",
      "average_rating": "3.55",
      "user_rating": "5"
  },
  {
      "upload_id": "c887efb4-0758-405f-8120-d04dbd0691aa",
      "book_id": "77507",
      "title": "Red Mars (Mars Trilogy, #1)",
      "author": "Kim Stanley Robinson",
      "dimensions": "9.1 x 6.3 x 1.7",
      "domColor": "#de8d7a",
      "fileName": "red_mars-9780553560732.png",
      "genre": "",
      "isbn": "0553560735",
      "isbn13": "9780553560732",
      "pubDate": "1992",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 27 Aug 2021 00:00:00 +0000",
      "average_rating": "3.86",
      "user_rating": "3"
  },
  {
      "upload_id": "f730464f-7136-4fe6-a518-854146ec8e04",
      "book_id": "17247",
      "title": "Macbeth (No Fear Shakespeare)",
      "author": "William Shakespeare",
      "dimensions": "5.2 x 0.6 x 7.4",
      "domColor": "#0b79a4",
      "fileName": "macbeth-9781586638467.jpg",
      "genre": "",
      "isbn": "1586638467",
      "isbn13": "9781586638467",
      "pubDate": "1623",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 26 May 2021 00:00:00 +0000",
      "average_rating": "3.77",
      "user_rating": "5"
  },
  {
      "upload_id": "01d3e956-f849-4f65-b5d1-b96ae08e1642",
      "book_id": "758621",
      "title": "Julius Caesar (Shakespeare Made Easy)",
      "author": "William Shakespeare",
      "dimensions": "5 x 0.6 x 7.25",
      "domColor": "#e6a707",
      "fileName": "julius_caesar-9780812035735.png",
      "genre": "",
      "isbn": "0812035739",
      "isbn13": "9780812035735",
      "pubDate": "1599",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 22 Apr 2021 00:00:00 +0000",
      "average_rating": "3.70",
      "user_rating": "5"
  },
  {
      "upload_id": "0cb0b1d3-c221-4e98-87d1-36f400a36a9a",
      "book_id": "24133",
      "title": "The Merchant of Venice (Shakespeare Made Easy)",
      "author": "William Shakespeare",
      "dimensions": "5 x 0.6 x 7.25",
      "domColor": "#dda86d",
      "fileName": "merchant_of_venice-9780812035704.png",
      "genre": "",
      "isbn": "0812035704",
      "isbn13": "9780812035704",
      "pubDate": "1596",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 12 Jun 2021 00:00:00 +0000",
      "average_rating": "3.77",
      "user_rating": "2"
  },
  {
      "upload_id": "7c7cbf81-cf80-4976-9dbf-7eaa7a52f7d7",
      "book_id": "30118",
      "title": "A Light in the Attic",
      "author": "Shel Silverstein",
      "dimensions": "10.1 x 1.11 x 11.11",
      "domColor": "#c4c4bb",
      "fileName": "a_light_in_the_attic-9780060513061.png",
      "genre": "",
      "isbn": "0060513063",
      "isbn13": "9780060513061",
      "pubDate": "1981",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 6 Sep 2021 00:00:00 +0000",
      "average_rating": "4.36",
      "user_rating": "4"
  },
  {
      "upload_id": "fa2be3ea-3d71-4c6b-8460-7e890849cadf",
      "book_id": "1797248",
      "title": "If I Did It: Confessions of the Killer",
      "author": "O.J. Simpson",
      "dimensions": "5.5 x 0.89 x 8.2",
      "domColor": "#d57d57",
      "fileName": "if_i_did_it-9780825305887.jpg",
      "genre": "",
      "isbn": "0825305888",
      "isbn13": "9780825305887",
      "pubDate": "2006",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 20 May 2021 00:00:00 +0000",
      "average_rating": "3.26",
      "user_rating": "2"
  },
  {
      "upload_id": "da949e3d-a633-42fc-baa8-05443961534f",
      "book_id": "525304",
      "title": "Star Maker",
      "author": "Olaf Stapledon",
      "dimensions": "6x1.4x8",
      "domColor": "#d8caaf",
      "fileName": "star_maker.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "1937",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 22 Apr 2021 00:00:00 +0000",
      "average_rating": "3.93",
      "user_rating": "5"
  },
  {
      "upload_id": "7f0474b3-56e4-4968-ab17-28738499bb55",
      "book_id": "80155",
      "title": "The Flight of the Eisenstein (The Horus Heresy, #4)",
      "author": "James Swallow",
      "dimensions": "4.19 x 1 x 6.75",
      "domColor": "#4f4e44",
      "fileName": "flight_of_eisenstein-9781844164592.png",
      "genre": "",
      "isbn": "1844164594",
      "isbn13": "9781844164592",
      "pubDate": "2007",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Wed, 26 May 2021 00:00:00 +0000",
      "average_rating": "4.05",
      "user_rating": "2"
  },
  {
      "upload_id": "a932a54d-a2e3-43d9-9a48-d8ec9995f125",
      "book_id": "13330442",
      "title": "Voyage to Kazohinia",
      "author": "Sándor Szathmári",
      "dimensions": "5.5 x 0.76 x 8.4",
      "domColor": "#222422",
      "fileName": "voyage_to_kazohinia-9780982578124.png",
      "genre": "",
      "isbn": "0982578121",
      "isbn13": "9780982578124",
      "pubDate": "1941",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sun, 16 May 2021 00:00:00 +0000",
      "average_rating": "3.81",
      "user_rating": "5"
  },
  {
      "upload_id": "3915be06-f763-4f72-94b5-bafa2df11cd5",
      "book_id": "32191710",
      "title": "Astrophysics for People in a Hurry",
      "author": "Neil deGrasse Tyson",
      "dimensions": "7.3 x 4.8 x 0.9",
      "domColor": "#34393e",
      "fileName": "astrophysics_for_people_in_a_hurry-9780393609394.png",
      "genre": "",
      "isbn": "0393609391",
      "isbn13": "9780393609394",
      "pubDate": "2017",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Fri, 14 May 2021 00:00:00 +0000",
      "average_rating": "4.07",
      "user_rating": "4"
  },
  {
      "upload_id": "83dbca80-41e2-4dd3-8b19-c27c7922aac7",
      "book_id": "17934530",
      "title": "Annihilation (Southern Reach, #1)",
      "author": "Jeff VanderMeer",
      "dimensions": "6.31 x 0.85 x 7.95",
      "domColor": "#e9e4dd",
      "fileName": "annihilation-9780374104092.png",
      "genre": "",
      "isbn": "0374104093",
      "isbn13": "9780374104092",
      "pubDate": "2014",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Sat, 12 Jun 2021 00:00:00 +0000",
      "average_rating": "3.79",
      "user_rating": "2"
  },
  {
      "upload_id": "934ce3a3-359f-4294-a9b0-cd582a2c075a",
      "book_id": "54493401",
      "title": "Project Hail Mary",
      "author": "Andy Weir",
      "dimensions": "6.33 x 1.53 x 9.57",
      "domColor": "#202319",
      "fileName": "project_hail_mary-9780593135204.png",
      "genre": "",
      "isbn": "0593135202",
      "isbn13": "9780593135204",
      "pubDate": "2021",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Mon, 18 Apr 2022 00:00:00 +0000",
      "average_rating": "4.49",
      "user_rating": "5"
  },
  {
      "upload_id": "476e0ef9-989a-4372-a67a-c84bcdcee627",
      "book_id": "5297",
      "title": "The Picture of Dorian Gray",
      "author": "Oscar Wilde",
      "dimensions": "6 x 1.35 x 7.5",
      "domColor": "#522b36",
      "fileName": "dorian_gray.png",
      "genre": "",
      "isbn": "",
      "isbn13": null,
      "pubDate": "1890",
      "submitter": "jonas",
      "rating": 0,
      "flagged": null,
      "user_read_at": "Thu, 6 May 2021 00:00:00 +0000",
      "average_rating": "4.13",
      "user_rating": "5"
  }
]
const IMG_URL_PREFIX = "https://bookshelf-spines.s3.amazonaws.com/";

class BookshelfRenderer {
  books = [];

  borderWidth = 50;
  shelfWidth = 1500;
  shelfWidthInches = 24;
  inchPixelRatio = this.shelfWidth / this.shelfWidthInches;
  rowHeight = 750;
  // the number of shelves is dynamic. A new shelf should be added after each row is completed.
  // TODO: Allow for max number of vertical shelves, then go horizontal.
  shelfBgColor = "#afb2b6";
  shelfBorderColor = "#454856";
  canvas = null;
  ctx = null;

  leftStart = this.borderWidth;
  leftCurrent = this.leftStart;
  bottomStart = this.rowHeight - this.borderWidth;
  bottomCurrent = this.bottomStart;

  constructor(books) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.shelfWidth;
    this.canvas.height = 0;
    this.ctx = this.canvas.getContext("2d");
    this.books = books;
  }

  async render() {
    await this.addNewShelfRow();
    this.loadSpines();
  }

  // todo make private
  renderImage() {
    // create and place image
    const b64 = this.canvas.toDataURL("image/png");

    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.src = b64;
  }

  convertInchesToPx(inches) {
    return inches * this.inchPixelRatio;
  }

  convertBookDimensionsToPx(book) {
    const dimensions = book.dimensions.split('x');
    const pxValues = dimensions.map(dimension => {
      const floatValue = Number(dimension.trim());
      return this.convertInchesToPx(floatValue);
    }).sort((a, b) => a - b);
    // smallest value should be spine width, largest should be height
    return {
      width: pxValues[0],
      height: pxValues[2],
    }
  }

  addNewShelfRow = async () => {
    const initialHeight = this.canvas.height;
    let image = null;
    if (initialHeight > 0) {
      // this means something has already been rendered.
      // changing the canvas size erases what was there previously
      // so we'll store what has been genereated so far and replace it after changing the height
      image = new Image();
      image.src = this.canvas.toDataURL("image/png");
      await image.decode();
    }
    this.canvas.height = initialHeight + this.rowHeight;
    if (image !== null) {
      this.ctx.drawImage(image, 0, 0);
    }
  
    // draw background
    this.ctx.fillStyle = this.shelfBgColor;
    this.ctx.fillRect(0, initialHeight, this.shelfWidth, this.rowHeight);
    // draw borders
    this.ctx.fillStyle = this.shelfBorderColor;
    // left border
    this.ctx.fillRect(0, initialHeight, this.borderWidth, this.rowHeight);
    // right border
    this.ctx.fillRect(this.shelfWidth - this.borderWidth, initialHeight, this.borderWidth, this.rowHeight);
    // top border
    this.ctx.fillRect(0, initialHeight, this.shelfWidth, this.borderWidth);
    // bottom border
    this.ctx.fillRect(0, this.rowHeight - this.borderWidth + initialHeight, this.shelfWidth, this.borderWidth);
  }

  loadSpines = async () => {
    for (const book of this.books) {
      const spine = new Image();
      spine.crossOrigin = "anonymous";
      spine.src = IMG_URL_PREFIX + book.fileName;
      // need to convert inches to px
      const dimensions = this.convertBookDimensionsToPx(book);
      // wait for image to load
      await spine.decode();
      if (this.leftCurrent > this.shelfWidth - (this.borderWidth * 2)) {
        this.leftCurrent = this.borderWidth;
        this.bottomCurrent += this.rowHeight;
        await this.addNewShelfRow();
      }
  
      // because canvas places the image from the top-left corner, we need to add the calculated height to the bottom
      this.ctx.drawImage(spine, this.leftCurrent, this.bottomCurrent - dimensions.height, dimensions.width, dimensions.height);
      this.leftCurrent += dimensions.width;
  
      this.renderImage();
    }
  }

  getAuthorLastName(author) {
    const authorNames = author.split(' ');
    return authorNames[authorNames.length - 1]; // this won't work if they're a JR or something
  }

  getRandomFloatInIntRange(minimum, maximum) {
    return (Math.random() * (maximum - minimum)) + minimum;
  }

  generateFakeSpine(incompleteBook) {
    // create a new canvas
    const spineCanvas = document.createElement("canvas");

    // Come up with a random height and width in a certain inch range, then convert to px
    const MINIMUM_HEIGHT_INCHES = 7;
    const MAXIMUM_HEIGHT_INCHES = 10;
    const MINIMUM_WIDTH_INCHES = .75;
    const MAXIMUM_WIDTH_INCHES = 2;
    const widthInPx = Math.floor(this.convertInchesToPx(this.getRandomFloatInIntRange(MINIMUM_WIDTH_INCHES, MAXIMUM_WIDTH_INCHES)));
    const heightInPx = Math.floor(this.convertInchesToPx(this.getRandomFloatInIntRange(MINIMUM_HEIGHT_INCHES, MAXIMUM_HEIGHT_INCHES)));
    
    // inverse height and width so the book is laying on its side (easier for writing text)
    spineCanvas.height = widthInPx;
    spineCanvas.width = heightInPx;
    const spineCtx = spineCanvas.getContext("2d");
    
    // select random background color and fill
    // could be completely random, but probably better to select from a list of approved colors for good contrast
    // all colors should look good in contrast with black
    const BG_COLORS = [
        "#f1faee",
        "#a8dadc",
        "#ff758f",
        "#ffddd2",
        "#ddb892",
        "#dde5b6"
    ];
    spineCtx.fillStyle = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
    spineCtx.fillRect(0, 0, heightInPx, widthInPx);

    // extract authors last name from the book
    const lastName = this.getAuthorLastName(incompleteBook.author);

    // TODO select random font from list of available fonts
    const font = "serif";

    // keep calculating the font until its between 20-30% of the spine
    const maxLastNameWidth = Math.floor(heightInPx * .3);
    const minLastNameWidth = Math.floor(heightInPx * .2);
    let currentFontSize = 48;
    let validMeasuredNameText = null;
    while (validMeasuredNameText == null) {
      spineCtx.font = currentFontSize.toString() + "px " + font;
      const measuredText = spineCtx.measureText(lastName);
      if (measuredText.fontBoundingBoxAscent > widthInPx || measuredText.width > maxLastNameWidth) {
        currentFontSize -= 1;
        continue;
      }
      if (measuredText.width < minLastNameWidth) {
        currentFontSize += 1;
        continue;
      }
      validMeasuredNameText = measuredText;
    }

    const nameXPosition = heightInPx - validMeasuredNameText.width - 10;
    let nameYPosition = Math.floor(widthInPx - validMeasuredNameText.fontBoundingBoxAscent);
    nameYPosition = nameYPosition + (nameYPosition / 2);
    console.log(nameYPosition);

    // place the last name on the book
    spineCtx.fillStyle = "#000000";
    spineCtx.fillText(lastName, nameXPosition, nameYPosition);

    // place the title on the book
    // rotate
    // convert to dataUrl
    const b64 = spineCanvas.toDataURL("image/png");

    // return object with dataurl string, heightInPx and widthInPx 
    return {
      dataURL: b64,
      heightInPx: heightInPx,
      widthInPx: widthInPx,
    }
  }

  getRandomHexColor() {
    // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
    const randomNumber = Math.floor(Math.random() * 16777216);
  
    // Convert the random number to a hexadecimal string
    const hexString = randomNumber.toString(16);
  
    // Pad the hexadecimal string with leading zeros if necessary
    const paddedHexString = hexString.padStart(6, '0');
  
    // Return the hexadecimal color code with a "#" prefix
    return `#${paddedHexString}`;
  }

}

const bookshelfRenderer = new BookshelfRenderer(bookTestData);
const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.src = bookshelfRenderer.generateFakeSpine({author: 'John Smith'}).dataURL;
// bookshelfRenderer.render();