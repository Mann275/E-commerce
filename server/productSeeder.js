import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./Database/db.js";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";



const seedProducts = async () => {
    await connectDB();

    try {
        await Product.deleteMany();
        console.log("Existing products deleted.");

        // Find the 3 sellers
        const sellerEmails = ["seller@example.com", "s1@example.com", "s2@example.com"]; // Based on userSeeder
        const sellers = await User.find({ email: { $in: sellerEmails } });

        if (sellers.length === 0) {
            console.error("No sellers found! Please run 'node userSeeder.js' first.");
            process.exit(1);
        }

        console.log(`Found ${sellers.length} sellers. Distributing products...`);

        const allProducts = [];

        sellers.forEach((seller, index) => {
            const sellerId = seller._id;

            let productsForSeller = [];

            if (index === 0) {
                // Seller 1: 5 Core Components
                productsForSeller = [
                    {
                        productName: "NVIDIA RTX 4090 Founders Edition",
                        productDesc: "The ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics. Features 24GB of G6X memory, delivering the ultimate experience for gamers and creators.",
                        productPrice: 165000,
                        category: "GPU",
                        brand: "NVIDIA",
                        quantity: 12,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800", public_id: "gpu_1" },
                            { url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800", public_id: "gpu_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "AMD Ryzen 9 7950X3D",
                        productDesc: "16-core, 32-thread desktop processor with AMD 3D V-Cache technology for incredible gaming performance. The dominant processor for creators and extreme gamers.",
                        productPrice: 62000,
                        category: "CPU / Processor",
                        brand: "AMD",
                        quantity: 25,
                        discountPercentage: 5,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800", public_id: "cpu_1" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "ASUS ROG Crosshair X670E Hero",
                        productDesc: "ATX motherboard ready for AMD Ryzen 7000 Series with PCIe 5.0, DDR5, and robust power delivery. An aesthetic masterpiece featuring Polymo lighting.",
                        productPrice: 58000,
                        category: "Motherboard",
                        brand: "ASUS ROG",
                        quantity: 8,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", public_id: "mobo_1" },
                            { url: "https://images.unsplash.com/photo-1541029071515-84cc54f84cb5?auto=format&fit=crop&q=80&w=800", public_id: "mobo_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Corsair Dominator Platinum RGB 64GB DDR5",
                        productDesc: "High-performance memory with stunning RGB lighting and custom PCB for overclocking. Pushing the limits of DDR5 performance.",
                        productPrice: 28500,
                        category: "RAM",
                        brand: "Corsair",
                        quantity: 15,
                        discountPercentage: 10,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800", public_id: "ram_1" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Samsung 990 PRO 2TB NVMe SSD",
                        productDesc: "Blazing fast PCIe 4.0 storage for intense gaming and heavy workloads. Sequential read/write speeds up to 7450/6900 MB/s.",
                        productPrice: 18000,
                        category: "Storage (SSD/HDD)",
                        brand: "Samsung",
                        quantity: 40,
                        discountPercentage: 12,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&q=80&w=800", public_id: "ssd_1" }
                        ],
                        userId: sellerId
                    }
                ];
            } else if (index === 1) {
                // Seller 2: Cooling, PSU, CPU, Cases
                productsForSeller = [
                    {
                        productName: "NZXT Kraken Elite 360 RGB",
                        productDesc: "High-performance liquid cooler with a massive 2.36\" LCD display. Keep your processor cold while displaying crisp system info or custom GIFs.",
                        productPrice: 26000,
                        category: "Cooling (Liquid/Air)",
                        brand: "NZXT",
                        quantity: 10,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1587202372742-df113d7ceebc?auto=format&fit=crop&q=80&w=800", public_id: "cooler_1" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "ASUS ROG Thor 1000W Platinum II",
                        productDesc: "Incredibly quiet and efficient power supply with an OLED display for real-time power draw monitoring.",
                        productPrice: 24500,
                        category: "Power Supply",
                        brand: "ASUS ROG",
                        quantity: 14,
                        discountPercentage: 8,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1555617781-dbdc797204fc?auto=format&fit=crop&q=80&w=800", public_id: "psu_1" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Lian Li O11 Dynamic EVO",
                        productDesc: "Versatile mid-tower chassis offering immense customizability and reversible design. The favorite of professional builders.",
                        productPrice: 16000,
                        category: "Cabinet",
                        brand: "Lian Li",
                        quantity: 22,
                        discountPercentage: 5,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800", public_id: "case_1" },
                            { url: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=800", public_id: "case_3" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Intel Core i9-14900K",
                        productDesc: "24 cores (8 P-cores + 16 E-cores) and 32 threads. Built for gamers looking for maximum performance to help play the latest games.",
                        productPrice: 58000,
                        category: "CPU / Processor",
                        brand: "Intel",
                        quantity: 18,
                        discountPercentage: 4,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800", public_id: "cpu_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "MSI GeForce RTX 4080 SUPER 16G GAMING X TRIO",
                        productDesc: "Experience ultra-high performance gaming, incredibly detailed virtual worlds, unprecedented productivity, and new ways to create.",
                        productPrice: 105000,
                        category: "GPU",
                        brand: "MSI",
                        quantity: 6,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800", public_id: "gpu_3" }
                        ],
                        userId: sellerId
                    }
                ];
            } else {
                // Seller 3: Mixed High-End HW
                productsForSeller = [
                    {
                        productName: "MSI MEG Z790 GODLIKE",
                        productDesc: "The pinnacle of intel motherboard design. Features an M-Vision dashboard, 26+2 power phases, and massive M.2 support.",
                        productPrice: 110000,
                        category: "Motherboard",
                        brand: "MSI",
                        quantity: 3,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", public_id: "mobo_3" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5",
                        productDesc: "Silver/Black brushed aluminum heatspreaders with a translucent light bar, optimized for maximum Intel hardware tuning.",
                        productPrice: 15500,
                        category: "RAM",
                        brand: "G.Skill",
                        quantity: 45,
                        discountPercentage: 15,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800", public_id: "ram_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "WD_BLACK 4TB SN850X NVMe SSD",
                        productDesc: "Crush load times and slash throttling, lagging, and model pop-ins with the WD_BLACK SN850X NVMe SSD, the gaming drive built for top-tier performance.",
                        productPrice: 32000,
                        category: "Storage (SSD/HDD)",
                        brand: "Western Digital",
                        quantity: 12,
                        discountPercentage: 8,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&q=80&w=800", public_id: "ssd_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Corsair RM1000x Shift 80 PLUS Gold",
                        productDesc: "Fully modular ATX power supply with side-mounted modular interface, taking the hassle out of cable management.",
                        productPrice: 19500,
                        category: "Power Supply",
                        brand: "Corsair",
                        quantity: 20,
                        discountPercentage: 5,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1555617781-dbdc797204fc?auto=format&fit=crop&q=80&w=800", public_id: "psu_2" }
                        ],
                        userId: sellerId
                    },
                    {
                        productName: "Phanteks NV7 Dual-Chamber Full Tower",
                        productDesc: "Showcase your build seamlessly with continuous glass panels. Ultra-clean cable routing and space for up to 12 fans.",
                        productPrice: 22000,
                        category: "Cabinet",
                        brand: "Phanteks",
                        quantity: 6,
                        discountPercentage: 0,
                        productImg: [
                            { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800", public_id: "case_4" },
                            { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800", public_id: "case_5" }
                        ],
                        userId: sellerId
                    }
                ];
            }

            allProducts.push(...productsForSeller);
        });

        await Product.insertMany(allProducts);
        console.log(`Successfully seeded ${allProducts.length} diverse products across ${sellers.length} sellers!`);

        process.exit();
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts();
