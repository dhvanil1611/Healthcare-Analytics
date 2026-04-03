import "reflect-metadata";
import { AppDataSource } from './src/data-source';
import { Hospital } from './src/entities/Hospital';

const ahmedabadHospitals = [
  {
    name: 'Apollo Hospitals International',
    area: 'Bhat / Gandhinagar Highway',
    address: 'Gandhinagar Highway, Bhat, Ahmedabad, Gujarat 382428',
    doctorName: 'Dr. Ramesh Goyal',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 9:00 PM',
    contactNumber: '+91-79-6677-0000',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500',
    latitude: 23.193,
    longitude: 72.649,
    description: 'Leading multi-specialty hospital with specialized diabetes care and endocrinology department',
    averageRating: 4.7,
    totalReviews: 0
  },
  {
    name: 'Shalby Hospitals',
    area: 'SG Highway',
    address: 'Shalby Hospitals, SG Highway, Ahmedabad, Gujarat 380054',
    doctorName: 'Dr. Shruti Khare',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 9:00 PM',
    contactNumber: '+91-79-4001-7890',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e5ca?w=500',
    latitude: 23.0676,
    longitude: 72.5265,
    description: 'Premium healthcare facility with advanced diabetes management programs',
    averageRating: 4.6,
    totalReviews: 0
  },
  {
    name: 'Zydus Hospitals',
    area: 'Thaltej',
    address: 'Zydus Hospital, Thaltej, Ahmedabad, Gujarat 380054',
    doctorName: 'Dr. Navneet Shah',
    specialization: 'Diabetes / Endocrinology',
    timings: '24/7',
    contactNumber: '+91-79-4009-2000',
    imageUrl: 'https://images.unsplash.com/photo-1615461066159-fac4ff1ada53?w=500',
    latitude: 23.058,
    longitude: 72.564,
    description: '24/7 emergency diabetes care with experienced endocrinologists',
    averageRating: 4.7,
    totalReviews: 0
  },
  {
    name: 'KD Hospital',
    area: 'Vaishnodevi Circle',
    address: 'KD Hospital, Vaishnodevi Circle, Ahmedabad, Gujarat 380061',
    doctorName: 'Dr. Akash Shah',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 8:00 PM',
    contactNumber: '+91-79-6667-5678',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500',
    latitude: 23.0225,
    longitude: 72.5714,
    description: 'Modern hospital with specialized diabetes and metabolic disorder treatment',
    averageRating: 4.5,
    totalReviews: 0
  },
  {
    name: 'Sterling Hospital',
    area: 'Gurukul',
    address: 'Sterling Hospital, Gurukul, Ahmedabad, Gujarat 380052',
    doctorName: 'Dr. Priya Patel',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 9:00 PM',
    contactNumber: '+91-79-4005-0000',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47201b5fcaea?w=500',
    latitude: 23.0431,
    longitude: 72.4833,
    description: 'State-of-the-art facility with dedicated diabetes center',
    averageRating: 4.6,
    totalReviews: 0
  },
  {
    name: 'CIMS Hospital',
    area: 'Science City',
    address: 'CIMS Hospital, Science City Road, Ahmedabad, Gujarat 380060',
    doctorName: 'Dr. Rajesh Kumar',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 8:00 PM',
    contactNumber: '+91-79-6666-3333',
    imageUrl: 'https://images.unsplash.com/photo-1576091160708-112edd4ff189?w=500',
    latitude: 23.0533,
    longitude: 72.5733,
    description: 'Advanced medical center specializing in diabetes prevention and management',
    averageRating: 4.6,
    totalReviews: 0
  },
  {
    name: 'SGVP Holistic Hospital',
    area: 'Chandkheda',
    address: 'SGVP Hospital, Chandkheda, Ahmedabad, Gujarat 382424',
    doctorName: 'Dr. Neha Singh',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 7:00 PM',
    contactNumber: '+91-79-3989-9999',
    imageUrl: 'https://images.unsplash.com/photo-1516627585753-f900dbf08a8a?w=500',
    latitude: 23.2192,
    longitude: 72.6084,
    description: 'Holistic approach to diabetes care with nutritionist and counseling services',
    averageRating: 4.5,
    totalReviews: 0
  },
  {
    name: 'Jivraj Mehta Hospital',
    area: 'Vasna',
    address: 'Jivraj Mehta Hospital, Vasna, Ahmedabad, Gujarat 380016',
    doctorName: 'Dr. Vikram Desai',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 6:00 PM',
    contactNumber: '+91-79-6740-0000',
    imageUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500',
    latitude: 23.046,
    longitude: 72.562,
    description: 'Renowned hospital with experienced diabetologists',
    averageRating: 4.4,
    totalReviews: 0
  },
  {
    name: 'Civil Hospital Ahmedabad',
    area: 'Asarwa',
    address: 'Civil Hospital, Asarwa, Ahmedabad, Gujarat 380016',
    doctorName: 'Dr. Anil Kumar',
    specialization: 'Diabetes / Endocrinology',
    timings: '8:00 AM - 8:00 PM',
    contactNumber: '+91-79-2141-5454',
    imageUrl: 'https://images.unsplash.com/photo-1538729399-0a36c4531f1e?w=500',
    latitude: 23.0433,
    longitude: 72.6033,
    description: 'Government hospital providing comprehensive diabetes care services',
    averageRating: 4.2,
    totalReviews: 0
  },
  {
    name: 'Saraswati Multispeciality Hospital',
    area: 'Bopal',
    address: 'Saraswati Hospital, Bopal, Ahmedabad, Gujarat 380058',
    doctorName: 'Dr. Pooja Sharma',
    specialization: 'Diabetes / Endocrinology',
    timings: '9:00 AM - 8:00 PM',
    contactNumber: '+91-79-4040-2020',
    imageUrl: 'https://images.unsplash.com/photo-1519494026067-143dfc5b3dbb?w=500',
    latitude: 23.0625,
    longitude: 72.501,
    description: 'Multi-specialty facility with specialized diabetes management team',
    averageRating: 4.3,
    totalReviews: 0
  }
];

async function seedHospitals() {
  try {
    await AppDataSource.initialize();
    const hospitalRepo = AppDataSource.getRepository(Hospital);

    // Check if hospitals already exist
    const existingCount = await hospitalRepo.count();
    if (existingCount > 0) {
      console.log('Hospitals already seeded. Skipping...');
      await AppDataSource.destroy();
      process.exit(0);
    }

    // Insert hospitals
    await hospitalRepo.save(ahmedabadHospitals);
    console.log('Successfully seeded 10 Ahmedabad hospitals');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hospitals:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seedHospitals();
