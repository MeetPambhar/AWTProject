import { PrismaClient, Role, ResourceStatus, ConditionStatus, BookingStatus, Priority, MaintenanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // =============================================
  // Insert Resource Types
  // =============================================
  const resourceTypes = [
    { id: 1, name: 'Classroom', description: 'Regular teaching classrooms', icon: 'school' },
    { id: 2, name: 'Laboratory', description: 'Science and computer laboratories', icon: 'flask' },
    { id: 3, name: 'Auditorium', description: 'Large halls for events and seminars', icon: 'presentation' },
    { id: 4, name: 'Conference Room', description: 'Meeting and conference rooms', icon: 'users' },
    { id: 5, name: 'Library', description: 'Reading rooms and study areas', icon: 'book-open' },
    { id: 6, name: 'Sports Facility', description: 'Indoor sports and gym facilities', icon: 'dumbbell' },
  ];

  for (const rt of resourceTypes) {
    await prisma.resourceType.upsert({
      where: { name: rt.name },
      update: {},
      create: {
        id: rt.id,
        name: rt.name,
        description: rt.description,
        icon: rt.icon,
      },
    });
  }

  // =============================================
  // Insert Buildings
  // =============================================
  const buildings = [
    { id: 1, name: 'Main Academic Block', location: 'Central Campus', floors: 4, description: 'Primary building for undergraduate classes' },
    { id: 2, name: 'Science Complex', location: 'North Campus', floors: 3, description: 'Houses all science laboratories' },
    { id: 3, name: 'Administrative Block', location: 'East Campus', floors: 2, description: 'Offices and conference rooms' },
    { id: 4, name: 'Library Building', location: 'Central Campus', floors: 3, description: 'Central library with study areas' },
    { id: 5, name: 'Sports Complex', location: 'South Campus', floors: 2, description: 'Indoor sports facilities and gym' },
  ];

  for (const b of buildings) {
    await prisma.building.upsert({
      where: { id: b.id },
      update: {},
      create: b,
    });
  }

  // =============================================
  // Insert Users
  // =============================================
  const users = [
    { id: 1, name: 'System Admin', email: 'admin@college.edu', password: '$2b$10$example_hashed_password', role: Role.admin, department: 'IT Department', phone: '1234567890' },
    { id: 2, name: 'John Doe', email: 'john@college.edu', password: '$2b$10$example_hashed_password', role: Role.user, department: 'Computer Science', phone: '9876543210' },
    { id: 3, name: 'Jane Smith', email: 'jane@college.edu', password: '$2b$10$example_hashed_password', role: Role.user, department: 'Electronics', phone: '5555555555' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // =============================================
  // Insert Resources
  // =============================================
  const resources = [
    { id: 1, name: 'Classroom 101', typeId: 1, buildingId: 1, floorNumber: 1, capacity: 60, status: ResourceStatus.available, description: 'Standard classroom with projector', amenities: ["Projector", "Whiteboard", "AC"] },
    { id: 2, name: 'Classroom 102', typeId: 1, buildingId: 1, floorNumber: 1, capacity: 60, status: ResourceStatus.available, description: 'Standard classroom with smart board', amenities: ["Smart Board", "AC", "Speakers"] },
    { id: 3, name: 'Classroom 201', typeId: 1, buildingId: 1, floorNumber: 2, capacity: 80, status: ResourceStatus.available, description: 'Large classroom for lectures', amenities: ["Projector", "Microphone", "AC"] },
    { id: 4, name: 'Computer Lab 1', typeId: 2, buildingId: 2, floorNumber: 1, capacity: 40, status: ResourceStatus.available, description: 'Computer lab with 40 workstations', amenities: ["Computers", "Projector", "AC"] },
    { id: 5, name: 'Physics Lab', typeId: 2, buildingId: 2, floorNumber: 2, capacity: 30, status: ResourceStatus.available, description: 'Physics experiments laboratory', amenities: ["Lab Equipment", "AC"] },
    { id: 6, name: 'Chemistry Lab', typeId: 2, buildingId: 2, floorNumber: 2, capacity: 30, status: ResourceStatus.maintenance, description: 'Chemistry experiments laboratory', amenities: ["Lab Equipment", "Fume Hood", "AC"] },
    { id: 7, name: 'Main Auditorium', typeId: 3, buildingId: 1, floorNumber: 0, capacity: 500, status: ResourceStatus.available, description: 'Main auditorium for events', amenities: ["Stage", "Sound System", "Projector", "AC"] },
    { id: 8, name: 'Conference Room A', typeId: 4, buildingId: 3, floorNumber: 1, capacity: 20, status: ResourceStatus.available, description: 'Executive conference room', amenities: ["Video Conferencing", "Whiteboard", "AC"] },
    { id: 9, name: 'Conference Room B', typeId: 4, buildingId: 3, floorNumber: 1, capacity: 15, status: ResourceStatus.available, description: 'Small meeting room', amenities: ["TV Screen", "Whiteboard", "AC"] },
    { id: 10, name: 'Reading Hall', typeId: 5, buildingId: 4, floorNumber: 1, capacity: 100, status: ResourceStatus.available, description: 'Silent reading area', amenities: ["Study Tables", "AC", "WiFi"] },
    { id: 11, name: 'Indoor Badminton Court', typeId: 6, buildingId: 5, floorNumber: 1, capacity: 4, status: ResourceStatus.available, description: 'Indoor badminton facility', amenities: ["Court", "Lighting"] },
    { id: 12, name: 'Gymnasium', typeId: 6, buildingId: 5, floorNumber: 1, capacity: 50, status: ResourceStatus.available, description: 'Fully equipped gym', amenities: ["Equipment", "AC", "Lockers"] },
  ];

  for (const r of resources) {
    await prisma.resource.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    });
  }

  // =============================================
  // Insert Sample Facilities
  // =============================================
  const facilities = [
    { resourceId: 1, name: 'Projector', quantity: 1, conditionStatus: ConditionStatus.good, notes: 'Epson HD Projector' },
    { resourceId: 1, name: 'Whiteboard', quantity: 2, conditionStatus: ConditionStatus.good, notes: 'Large whiteboards' },
    { resourceId: 1, name: 'Student Desks', quantity: 60, conditionStatus: ConditionStatus.good, notes: 'Standard desks with attached chairs' },
    { resourceId: 4, name: 'Desktop Computers', quantity: 40, conditionStatus: ConditionStatus.good, notes: 'Dell Optiplex systems' },
    { resourceId: 4, name: 'Projector', quantity: 1, conditionStatus: ConditionStatus.good, notes: 'Ceiling mounted projector' },
    { resourceId: 7, name: 'Stage Lights', quantity: 20, conditionStatus: ConditionStatus.good, notes: 'Professional stage lighting' },
    { resourceId: 7, name: 'Sound System', quantity: 1, conditionStatus: ConditionStatus.good, notes: 'Bose professional sound system' },
  ];

  for (const f of facilities) {
    // Create facilities (no unique ID in seed, so we just create if not exists or createMany)
    // To avoid duplicates on multiple runs, we can check count or delete first.
    // For simplicity in this seed, we'll try to find first or create.
    const exists = await prisma.facility.findFirst({
        where: { resourceId: f.resourceId, name: f.name }
    });
    
    if (!exists) {
        await prisma.facility.create({ data: f });
    }
  }

  // =============================================
  // Insert Sample Bookings
  // =============================================
  // Note: Using dynamic dates relative to current time as per prompt: CURDATE, DATE_ADD
  const today = new Date();
  const twoDaysLater = new Date(today); twoDaysLater.setDate(today.getDate() + 2);
  const sevenDaysLater = new Date(today); sevenDaysLater.setDate(today.getDate() + 7);

  const bookings = [
    { resourceId: 1, userId: 2, bookingDate: today, startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T11:00:00Z'), purpose: 'Data Structures Lecture', status: BookingStatus.approved },
    { resourceId: 4, userId: 2, bookingDate: today, startTime: new Date('1970-01-01T14:00:00Z'), endTime: new Date('1970-01-01T16:00:00Z'), purpose: 'Programming Lab Session', status: BookingStatus.pending },
    { resourceId: 7, userId: 3, bookingDate: sevenDaysLater, startTime: new Date('1970-01-01T10:00:00Z'), endTime: new Date('1970-01-01T13:00:00Z'), purpose: 'Department Seminar', status: BookingStatus.pending },
    { resourceId: 8, userId: 2, bookingDate: twoDaysLater, startTime: new Date('1970-01-01T11:00:00Z'), endTime: new Date('1970-01-01T12:00:00Z'), purpose: 'Project Discussion', status: BookingStatus.approved },
  ];

  for (const b of bookings) {
       // A simple check to prevent duplicates if running seed multiple times
       const exists = await prisma.booking.findFirst({
         where: { resourceId: b.resourceId, userId: b.userId, bookingDate: b.bookingDate, startTime: b.startTime }
       });
       if (!exists) {
         await prisma.booking.create({ data: b });
       }
  }

  // =============================================
  // Insert Sample Maintenance Records
  // =============================================
  const maintenance = [
    { resourceId: 6, reportedBy: 2, issueTitle: 'Fume Hood Not Working', issueDescription: 'The fume hood in chemistry lab is not extracting properly', priority: Priority.high, status: MaintenanceStatus.in_progress },
    { resourceId: 1, reportedBy: 3, issueTitle: 'Projector Bulb Dim', issueDescription: 'The projector bulb needs replacement', priority: Priority.medium, status: MaintenanceStatus.reported },
  ];

  for (const m of maintenance) {
      const exists = await prisma.maintenance.findFirst({
          where: { resourceId: m.resourceId, issueTitle: m.issueTitle }
      });
      if (!exists) {
          await prisma.maintenance.create({ data: m });
      }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
