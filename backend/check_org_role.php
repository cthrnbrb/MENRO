<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== USER_ORGANIZATIONS TABLE STRUCTURE ===\n\n";

$columns = DB::select('PRAGMA table_info(user_organizations)');

foreach ($columns as $col) {
    echo "- " . $col->name . " (" . $col->type . ")";
    if ($col->notnull) echo " NOT NULL";
    if ($col->default_value !== null) echo " DEFAULT " . $col->default_value;
    echo "\n";
}

echo "\n=== SAMPLE DATA ===\n\n";

$records = DB::table('user_organizations')->limit(3)->get();

foreach ($records as $record) {
    echo "ID: {$record->id}\n";
    echo "User ID: {$record->user_id}\n";
    echo "Organization ID: {$record->organization_id}\n";
    echo "Org Role: " . ($record->org_role ?? 'NULL') . "\n";
    echo "Status: {$record->status}\n";
    echo "---\n";
}
