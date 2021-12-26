import { PrismaClient, Prisma } from '@prisma/client';
import uniqid from 'uniqid';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [ // ProductCreateInput
	{
		id: uniqid(),
		first_name: 'john',
		last_name: 'doe',
		email: 'email1@email.com',
		password: 'password',
		age: 34,
		purchased_products: '',
	},
	{
		id: uniqid(),
		first_name: 'jane',
		last_name: 'doe',
		email: 'email1@email.com',
		password: 'password',
		age: 32,
		purchased_products: '',
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of userData) {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(`Created user with id: ${user.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
