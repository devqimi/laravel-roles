<?php
// database/seeders/RolePermissionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'view dashboard',
            'view any permissions',
            'view permissions',
            'create permissions',
            'update permission',
            'delete permission',
            'view any roles',
            'view role',
            'update roles',
            'create roles',
            'delete role',
            'view any users',
            'view user',
            'update users',
            'create user',
            'delete user',
            'Create CRF',
            'verified CRF',
            'Acknowledge CRF by ITD',
            'Assign CRF To ITD',
            'Assign CRF to Vendor',
            'Re Assign CRF To Vendor',
            'ITD Follow Up / Assign Allocate PIC',
            'Vendor Follow Up / Assign Allocate PIC',
            'Re Assign PIC ITD',
            'Re Assign PIC Vendor',
            'Update CRF (own CRF)',
            'Update CRF for Others ITD',
            'Update CRF for Others Vendor',
            'View Personal CRF',
            'View Department CRF',
            'View ALL CRF',
            'View ITD CRF',
            'View Vendor CRF',
            'Close Assigned CRF',
            'Closed other Assigned CRF Vendor',
            'Close other Assigned CRF ITD',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and Assign Permissions

        // 1. HOU (Head of Unit) Role - ID: 4
        $hou = Role::firstOrCreate(['name' => 'HOU']);
        $hou->syncPermissions([
            'verified CRF',
            'view dashboard',
            'View Department CRF',
        ]);

        // 2. ITD ADMIN Role - ID: 1
        $itdAdmin = Role::firstOrCreate(['name' => 'ITD ADMIN']);
        $itdAdmin->syncPermissions([
            'Acknowledge CRF by ITD',
            'Assign CRF To ITD',
            'Assign CRF to Vendor',
            'Close Assigned CRF',
            'Close other Assigned CRF ITD',
            'create permissions',
            'create roles',
            'create user',
            'delete permission',
            'delete role',
            'delete user',
            'Re Assign CRF To Vendor',
            'Re Assign PIC ITD',
            'Re Assign PIC Vendor',
            'update permission',
            'update roles',
            'update users',
            'view any permissions',
            'view any roles',
            'view any users',
            'view dashboard',
            'View ITD CRF',
            'view permissions',
            'view role',
            'view user',
            'View Vendor CRF',
        ]);

        // 3. ITD PIC Role - ID: 5
        $itdPic = Role::firstOrCreate(['name' => 'ITD PIC']);
        $itdPic->syncPermissions([
            'Close Assigned CRF',
            'ITD Follow Up / Assign Allocate PIC',
            'Update CRF (own CRF)',
            'Update CRF for Others ITD',
            'view dashboard',
            'View Department CRF',
            'View ITD CRF',
            'View Personal CRF',
        ]);

        // 4. USER Role - ID: 7
        $user = Role::firstOrCreate(['name' => 'USER']);
        $user->syncPermissions([
            'Create CRF',
            'view dashboard',
            'View Personal CRF',
        ]);

        // 5. VENDOR ADMIN Role - ID: 8
        $vendorAdmin = Role::firstOrCreate(['name' => 'VENDOR ADMIN']);
        $vendorAdmin->syncPermissions([
            'Closed other Assigned CRF Vendor',
            'Re Assign PIC Vendor',
            'Vendor Follow Up / Assign Allocate PIC',
            'View ALL CRF',
            'view dashboard',
            'View Department CRF',
            'View Personal CRF',
            'View Vendor CRF',
        ]);

        // 6. VENDOR PIC Role - ID: 6
        $vendorPic = Role::firstOrCreate(['name' => 'VENDOR PIC']);
        $vendorPic->syncPermissions([
            'Close Assigned CRF',
            'Update CRF (own CRF)',
            'Update CRF for Others Vendor',
            'view dashboard',
            'View Department CRF',
            'View Personal CRF',
            'View Vendor CRF',
        ]);

        $this->command->info('Roles and Permissions created successfully!');
        $this->command->info('');
        $this->command->info('Created Roles:');
        $this->command->info('1. HOU - 3 permissions');
        $this->command->info('2. ITD ADMIN - 26 permissions');
        $this->command->info('3. ITD PIC - 8 permissions');
        $this->command->info('4. USER - 3 permissions');
        $this->command->info('5. VENDOR ADMIN - 8 permissions');
        $this->command->info('6. VENDOR PIC - 7 permissions');
    }
}