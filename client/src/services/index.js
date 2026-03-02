// ============================================================================
// SERVICES INDEX - Central Export Point
// ============================================================================
// Export all services from a single entry point
// Makes imports cleaner: import { authService, productService } from '@/services'
// ============================================================================

export { default as authService } from "./authService";
export { default as userService } from "./userService";
export { default as productService } from "./productService";
export { default as cartService } from "./cartService";
export { default as wishlistService } from "./wishlistService";
export { default as orderService } from "./orderService";
export { default as adminService } from "./adminService";
export { default as couponService } from "./couponService";
