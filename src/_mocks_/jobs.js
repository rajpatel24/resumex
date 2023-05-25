import faker from 'faker';
// utils
import { mockImgCover } from '../utils/mockImages';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'Whiteboard Templates By Industry Leaders',
  'Tesla Cybertruck-inspired camper trailer for Tesla fans who can’t just wait for the truck!',
  'Designify Agency Landing Page Design',
  '✨What is Done is Done ✨',
  'Fresh Prince',
  'Six Socks Studio',
  'vincenzo de cotiis’ crossing over showcases a research on contamination',
  'Simple, Great Looking Animations in Your Project | Video Tutorial',
  '40 Free Serif Fonts for Digital Designers',
  'Examining the Evolution of the Typical Web Design Client',
  'Katie Griffin loves making that homey art',
  'The American Dream retold through mid-century railroad graphics',
  'Illustration System Design',
  'CarZio-Delivery Driver App SignIn/SignUp',
  'How to create a client-serverless Jamstack app using Netlify, Gatsby and Fauna',
  'Tylko Organise effortlessly -3D & Motion Design',
  'RAYO ?? A expanded visual arts festival identity',
  'Anthony Burrill and Wired mag’s Andrew Diprose discuss how they made January’s Change Everything cover',
  'Inside the Mind of Samuel Day',
  'Portfolio Review: Is This Portfolio Too Creative?',
  'Akkers van Margraten',
  'Gradient Ticket icon',
  'Here’s a Dyson motorcycle concept that doesn’t ‘suck’!',
  'How to Animate a SVG with border-image'
];

const posts = [{"id":"7c7052ef-53a2-4045-86dc-596a7baa5036","cover":"/static/mock-images/covers/cover_1.jpg","title":"Tesla Cybertruck-inspired camper trailer for Tesla fans who can’t just wait for the truck!","createdAt":"2021-03-19T03:59:41.424Z","view":37736,"comment":16726,"share":76455,"favorite":80796,"author":{"name":"Lyle Mills","avatarUrl":"/static/mock-images/avatars/avatar_1.jpg"}},{"id":"5246441a-6fa4-4027-80e3-15be79f5f004","cover":"/static/mock-images/covers/cover_2.jpg","title":"Designify Agency Landing Page Design","createdAt":"2021-06-07T18:34:10.643Z","view":51310,"comment":22589,"share":72973,"favorite":50477,"author":{"name":"Jon Kub","avatarUrl":"/static/mock-images/avatars/avatar_2.jpg"}},{"id":"d08010ea-0ea5-45d9-b4ad-f2a25d71bb83","cover":"/static/mock-images/covers/cover_3.jpg","title":"✨What is Done is Done ✨","createdAt":"2021-01-19T21:16:56.116Z","view":49586,"comment":7877,"share":59356,"favorite":54618,"author":{"name":"Jon Lowe","avatarUrl":"/static/mock-images/avatars/avatar_3.jpg"}},{"id":"133d8401-8bb0-4031-9739-3a22611a84f8","cover":"/static/mock-images/covers/cover_4.jpg","title":"Fresh Prince","createdAt":"2021-08-14T21:54:16.184Z","view":4602,"comment":19707,"share":26462,"favorite":70011,"author":{"name":"Lucia Paucek","avatarUrl":"/static/mock-images/avatars/avatar_4.jpg"}},{"id":"8401f394-2028-4124-8b6a-5df2ec7dfca9","cover":"/static/mock-images/covers/cover_5.jpg","title":"Six Socks Studio","createdAt":"2021-04-24T17:42:39.179Z","view":4979,"comment":92494,"share":74664,"favorite":95837,"author":{"name":"Ana Gottlieb Jr.","avatarUrl":"/static/mock-images/avatars/avatar_5.jpg"}},{"id":"66c19e69-f46d-43af-9214-3da05f529de5","cover":"/static/mock-images/covers/cover_6.jpg","title":"vincenzo de cotiis’ crossing over showcases a research on contamination","createdAt":"2021-07-21T02:08:10.535Z","view":11023,"comment":92186,"share":97649,"favorite":68184,"author":{"name":"Joyce Bernier","avatarUrl":"/static/mock-images/avatars/avatar_6.jpg"}},{"id":"2989dcfa-3c9e-4dfd-a5af-a2cf0542d411","cover":"/static/mock-images/covers/cover_7.jpg","title":"Simple, Great Looking Animations in Your Project | Video Tutorial","createdAt":"2021-12-24T18:15:58.074Z","view":91256,"comment":94154,"share":87873,"favorite":54529,"author":{"name":"Gary Rippin","avatarUrl":"/static/mock-images/avatars/avatar_7.jpg"}},{"id":"eb1d9c2e-cdf1-4421-8fe2-4d28019f24d4","cover":"/static/mock-images/covers/cover_8.jpg","title":"40 Free Serif Fonts for Digital Designers","createdAt":"2021-01-10T09:34:51.556Z","view":555,"comment":73746,"share":87958,"favorite":15312,"author":{"name":"Tina Treutel","avatarUrl":"/static/mock-images/avatars/avatar_8.jpg"}},{"id":"560e8663-b5f1-432e-947a-059f32d46fb4","cover":"/static/mock-images/covers/cover_9.jpg","title":"Examining the Evolution of the Typical Web Design Client","createdAt":"2021-07-16T00:09:58.908Z","view":15457,"comment":17106,"share":79363,"favorite":3090,"author":{"name":"Marguerite Terry","avatarUrl":"/static/mock-images/avatars/avatar_9.jpg"}},{"id":"69143944-fcdc-4dd8-9372-c09c2d4128b1","cover":"/static/mock-images/covers/cover_10.jpg","title":"Katie Griffin loves making that homey art","createdAt":"2021-12-20T12:14:00.218Z","view":70605,"comment":67484,"share":32118,"favorite":65755,"author":{"name":"Lowell Steuber","avatarUrl":"/static/mock-images/avatars/avatar_10.jpg"}},{"id":"6c22c114-b901-420b-bd8b-daa6495015c3","cover":"/static/mock-images/covers/cover_11.jpg","title":"The American Dream retold through mid-century railroad graphics","createdAt":"2021-03-30T08:45:49.430Z","view":7203,"comment":15445,"share":46164,"favorite":1068,"author":{"name":"Mrs. Maureen Cremin","avatarUrl":"/static/mock-images/avatars/avatar_11.jpg"}},{"id":"dc071b9a-e0aa-4c27-a954-a877a7698f0f","cover":"/static/mock-images/covers/cover_12.jpg","title":"Illustration System Design","createdAt":"2021-12-23T05:12:24.298Z","view":21367,"comment":80114,"share":80676,"favorite":12181,"author":{"name":"Adrian Douglas","avatarUrl":"/static/mock-images/avatars/avatar_12.jpg"}},{"id":"554dec61-3400-4f0e-9930-a6485b621e35","cover":"/static/mock-images/covers/cover_13.jpg","title":"CarZio-Delivery Driver App SignIn/SignUp","createdAt":"2021-08-14T22:15:36.552Z","view":90814,"comment":75350,"share":49145,"favorite":24591,"author":{"name":"Vanessa Hudson","avatarUrl":"/static/mock-images/avatars/avatar_13.jpg"}},{"id":"968d735d-6a84-4f6c-a407-2e596972ae3a","cover":"/static/mock-images/covers/cover_14.jpg","title":"How to create a client-serverless Jamstack app using Netlify, Gatsby and Fauna","createdAt":"2021-04-12T22:30:01.090Z","view":4103,"comment":58506,"share":12254,"favorite":3406,"author":{"name":"Lindsay Christiansen","avatarUrl":"/static/mock-images/avatars/avatar_14.jpg"}},{"id":"a08e841a-47cc-4df3-809e-96f1ff3395c6","cover":"/static/mock-images/covers/cover_15.jpg","title":"Tylko Organise effortlessly -3D & Motion Design","createdAt":"2021-05-26T22:57:15.638Z","view":82937,"comment":53475,"share":83979,"favorite":55900,"author":{"name":"Paula Toy","avatarUrl":"/static/mock-images/avatars/avatar_15.jpg"}},{"id":"92c56d02-9451-4603-9032-251f82438b2c","cover":"/static/mock-images/covers/cover_16.jpg","title":"RAYO ?? A expanded visual arts festival identity","createdAt":"2021-10-16T13:54:32.539Z","view":53121,"comment":66713,"share":7766,"favorite":44142,"author":{"name":"Kristie Hammes","avatarUrl":"/static/mock-images/avatars/avatar_16.jpg"}},{"id":"0d1026dd-dc88-4248-8d10-21b83724cbdb","cover":"/static/mock-images/covers/cover_17.jpg","title":"Anthony Burrill and Wired mag’s Andrew Diprose discuss how they made January’s Change Everything cover","createdAt":"2021-04-05T03:39:40.117Z","view":42449,"comment":9970,"share":70746,"favorite":14740,"author":{"name":"Sophie Becker","avatarUrl":"/static/mock-images/avatars/avatar_17.jpg"}},{"id":"b5346183-3fd5-4108-a8d9-103ff1fc7dc0","cover":"/static/mock-images/covers/cover_18.jpg","title":"Inside the Mind of Samuel Day","createdAt":"2021-12-29T14:08:28.875Z","view":1701,"comment":36286,"share":78430,"favorite":31782,"author":{"name":"Meredith Aufderhar","avatarUrl":"/static/mock-images/avatars/avatar_18.jpg"}},{"id":"8ee93c16-29ad-40e4-88a9-ea74762cbcc7","cover":"/static/mock-images/covers/cover_19.jpg","title":"Portfolio Review: Is This Portfolio Too Creative?","createdAt":"2021-08-23T11:12:22.361Z","view":54356,"comment":98053,"share":38543,"favorite":76308,"author":{"name":"Ismael Murazik","avatarUrl":"/static/mock-images/avatars/avatar_19.jpg"}},{"id":"f4df6cac-bf24-4b33-8f62-271630542aab","cover":"/static/mock-images/covers/cover_20.jpg","title":"Akkers van Margraten","createdAt":"2021-02-19T22:41:43.311Z","view":99461,"comment":64720,"share":68800,"favorite":44525,"author":{"name":"Sabrina Schumm","avatarUrl":"/static/mock-images/avatars/avatar_20.jpg"}},{"id":"1c2bcf49-7a44-4968-98e5-0f52e927e38d","cover":"/static/mock-images/covers/cover_21.jpg","title":"Gradient Ticket icon","createdAt":"2021-01-16T10:47:44.595Z","view":45936,"comment":59146,"share":76661,"favorite":1605,"author":{"name":"Kellie Bechtelar","avatarUrl":"/static/mock-images/avatars/avatar_21.jpg"}},{"id":"f359de69-8b77-4223-bf27-078ed0b4d234","cover":"/static/mock-images/covers/cover_22.jpg","title":"Here’s a Dyson motorcycle concept that doesn’t ‘suck’!","createdAt":"2021-08-15T10:54:07.489Z","view":98396,"comment":69736,"share":91622,"favorite":55783,"author":{"name":"Miss Marvin Dickinson","avatarUrl":"/static/mock-images/avatars/avatar_22.jpg"}},{"id":"eda2d1d1-ab89-494e-a6e6-5b2a0698d205","cover":"/static/mock-images/covers/cover_23.jpg","title":"How to Animate a SVG with border-image","createdAt":"2021-02-19T03:47:41.970Z","view":40491,"comment":75993,"share":21920,"favorite":12489,"author":{"name":"Woodrow Barton","avatarUrl":"/static/mock-images/avatars/avatar_23.jpg"}}]

export default posts;