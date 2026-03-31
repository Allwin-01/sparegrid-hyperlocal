
export interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  district: string;
  rating: number;
  status: 'Open' | 'Closed';
}

export const SHOPS_DATA: Shop[] = [
  // Tiruppur Stores (Sample from OCR)
  { id: 1, name: "Tirupur Auto Spares", address: "No.16/63, Pudhuthottam Main Street, Palladam Main Rd, Tiruppur, TN 641604", phone: "+91-98941-67195", district: "Tiruppur", rating: 4.5, status: 'Open' },
  { id: 2, name: "New Auto Spares", address: "Bus stop, 81, PN Rd near Shanthi theatre, MGR Nagar, Tiruppur, TN 641602", phone: "", district: "Tiruppur", rating: 4.2, status: 'Open' },
  { id: 3, name: "Ramdev Auto Spares", address: "60 Feet Road, 700, PN Rd corner, Tiruppur, TN 641602", phone: "", district: "Tiruppur", rating: 4.3, status: 'Open' },
  { id: 4, name: "Mahendra Auto Spare Parts", address: "238, PN Rd, Kamaraj Nagar, Tiruppur, TN 641602", phone: "", district: "Tiruppur", rating: 4.1, status: 'Open' },
  { id: 5, name: "Vaishnavi Auto Spares", address: "47/27-29, Mariamman Koil Street, Ramanathapuram Extn, PN Road, Tiruppur, TN 641602", phone: "7947126520", district: "Tiruppur", rating: 4.4, status: 'Open' },
  { id: 6, name: "TVS - Bharath Autos", address: "No 54/2/770 F PN Road (Opp 60 Feet Rd), Tiruppur, TN 641602", phone: "+91-88793-29932", district: "Tiruppur", rating: 4.6, status: 'Open' },
  { id: 7, name: "Shree Carz", address: "Opp Reason Shop, Koothampalayam Pirivu, PN Road, Tiruppur, TN 641602", phone: "+91-99654-52555", district: "Tiruppur", rating: 4.7, status: 'Open' },
  { id: 8, name: "Ambal Auto Spares", address: "377, Tiruppur - Palladam Rd, Town Extn, Tiruppur, TN 641604", phone: "+91-98652-15157", district: "Tiruppur", rating: 4.3, status: 'Open' },
  { id: 9, name: "Sri Badhraa Auto Stores", address: "Palladam Main Rd near Surya Theatre, Karuppa Gaundanpalayam, Tiruppur, TN 641605", phone: "", district: "Tiruppur", rating: 4.2, status: 'Open' },
  { id: 10, name: "Vallalar Auto Spares", address: "58/1, Kangayam Cross Rd, Chellappapuram, Tiruppur, TN 641604", phone: "7942699690", district: "Tiruppur", rating: 4.5, status: 'Open' },
  { id: 11, name: "Senthil Auto Spares", address: "Mangalam Rd, Palagudown, Karuvampalayam, Tiruppur, TN 641604", phone: "7942688600", district: "Tiruppur", rating: 4.4, status: 'Open' },
  { id: 12, name: "Nila Auto Parts", address: "No 524, Near Chennai Mobile, Old Bus Stand, Aranmanai Pudur, Dharapuram Road, Tirupur 641604", phone: "7947108126", district: "Tiruppur", rating: 4.6, status: 'Open' },
  { id: 13, name: "Sun Plus Auto Spares", address: "Near Rto Office, Kumar Nagar 1st Street, Kumarnagar, Tirupur-641603", phone: "7942693823", district: "Tiruppur", rating: 4.3, status: 'Open' },
  { id: 14, name: "SRI AUTO SPARES", address: "Main Road, Kannipiran Colony, Valipalayam, Tiruppur, TN 641601", phone: "7947433615", district: "Tiruppur", rating: 4.5, status: 'Open' },
  { id: 15, name: "SRI KRISHNA AUTO SPARES", address: "75, Union Mill Rd, KPN Colony, Valipalayam, Tiruppur, TN 641601", phone: "7947104076", district: "Tiruppur", rating: 4.4, status: 'Open' },

  // Coimbatore Stores (Sample from OCR)
  { id: 101, name: "Thanukkodi Aditya Auto Stores", address: "No. 165, Dr. Nanjappa Road, Coimbatore Central, Coimbatore, TN 641018", phone: "7383040816", district: "Coimbatore", rating: 4.8, status: 'Open' },
  { id: 102, name: "Bombay Auto Parts", address: "635 H, G P Complex, Sathy Road, Gandhipuram, Coimbatore, TN 641012", phone: "", district: "Coimbatore", rating: 4.5, status: 'Open' },
  { id: 103, name: "Saravana Auto Spares", address: "No 20, Opposite Hp Petrol Bunk, Mettupalayam Road, Thudialur, Coimbatore 641034", phone: "7947152401", district: "Coimbatore", rating: 4.4, status: 'Open' },
  { id: 104, name: "Esskay Carz Parts", address: "No. 102, 100 Feet Road, Gandhipuram, Coimbatore, TN 641012", phone: "7259412802", district: "Coimbatore", rating: 4.6, status: 'Open' },
  { id: 105, name: "Golden Auto Spares And Accessories", address: "Opposite Saru Ceramics Odanthurai, Kotagiri Road, Mettupalayam, Coimbatore-641301", phone: "7947417612", district: "Coimbatore", rating: 4.3, status: 'Open' },
  { id: 106, name: "Sri Guruvayurappan Auto Stores", address: "No 30/2, Vijay Complex, Back Side Saburban Primary School, Ram Nagar, Coimbatore-641009", phone: "7947141890", district: "Coimbatore", rating: 4.7, status: 'Open' },
  { id: 107, name: "Sastha Auto Parts & Oil Store", address: "Shop No. 15, Sathy Road, Ganapathy, Coimbatore, TN 641006", phone: "7947145069", district: "Coimbatore", rating: 4.4, status: 'Open' },
  { id: 108, name: "Aditya Automobile Spares Pvt Ltd", address: "No 5, Near LVB Bank, Mattupalayam Road, Kavundampalayam, Coimbatore-641030", phone: "7942691420", district: "Coimbatore", rating: 4.5, status: 'Open' },
  { id: 109, name: "Senthil Auto Electricals", address: "No 21-A, Opposite to Uzhavar Sandhai, Vasanth Nagar, Singanallur, Coimbatore 641005", phone: "09054756372", district: "Coimbatore", rating: 4.2, status: 'Open' },
  { id: 110, name: "Psk Auto Parts", address: "544/1, Thippu Sulthan Market, Near Court, Thendral Nagar, Mettupalayam, Coimbatore 641301", phone: "08460562466", district: "Coimbatore", rating: 4.3, status: 'Open' },
  { id: 111, name: "Spare World", address: "Shop No 130/2A, Edayarpalayam Pirivu, Opposite Church, Palakkad Main Road, Kunniyamuthur, Coimbatore-641008", phone: "7947422014", district: "Coimbatore", rating: 4.6, status: 'Open' },
  { id: 112, name: "Dhanam Auto Stores", address: "Block No 120, Near City Tower Hotel, Sengupta Street, Ram Nagar, Coimbatore 641009", phone: "7947133682", district: "Coimbatore", rating: 4.4, status: 'Open' },
  { id: 113, name: "Jai Krishna Auto Parts", address: "425, Ram Nagar, Gandhi Puram, Near Dhanalakshmi Bank, Ram Nagar, Coimbatore-641009", phone: "7942693495", district: "Coimbatore", rating: 4.5, status: 'Open' },
  { id: 114, name: "Jaikrishna Auto Pvt Ltd", address: "Shop No 112, Jubli Complex, Venkatasamy Layout, Siddhapudur, Coimbatore-641044", phone: "7947150737", district: "Coimbatore", rating: 4.4, status: 'Open' },
  { id: 115, name: "Infinity Automobile Spares", address: "No 21 A1, Near Mds Bakery, Pattanam Privu, L & T Bypass Road, Pattanam, Coimbatore 641016", phone: "7942686979", district: "Coimbatore", rating: 4.5, status: 'Open' },

  // Other Regions (Retained from previous mock data/logic)
  { id: 201, name: "Salem Motor Mart", address: "Five Roads, Salem, TN 636004", phone: "0427-2445566", district: "Salem", rating: 4.6, status: 'Open' },
  { id: 202, name: "Erode Auto Zone", address: "Brough Road, Erode, TN 638001", phone: "0424-2223344", district: "Erode", rating: 4.4, status: 'Open' },
  { id: 203, name: "Gobi Spares", address: "Main Road, Gobichettipalayam, TN 638452", phone: "04285-222111", district: "Gobi", rating: 4.3, status: 'Open' },
];
