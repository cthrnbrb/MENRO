<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'org_name',
        'president_id',
        'organization_code',
    ];

    public function president()
    {
        return $this->belongsTo(User::class, 'president_id');
    }

    public function userOrganizations()
    {
        return $this->hasMany(UserOrganization::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, UserOrganization::class, 'organization_id', 'id', 'id', 'user_id');
    }

    public function plantingActivities()
    {
        return $this->hasMany(PlantingActivity::class, 'organization_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'organization_id');
    }
}
