<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'city',
        'phone',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the child profiles for this parent user.
     */
    public function childProfiles(): HasMany
    {
        return $this->hasMany(ChildProfile::class, 'parent_id');
    }

    /**
     * Get only active child profiles.
     */
    public function activeChildProfiles(): HasMany
    {
        return $this->childProfiles()->where('is_active', true);
    }

    /**
     * Get all purchased plans by this parent.
     */
    public function purchasedPlans(): HasMany
    {
        return $this->hasMany(PurchasedPlan::class);
    }

    /**
     * Get active purchased plans.
     */
    public function activePurchasedPlans(): HasMany
    {
        return $this->purchasedPlans()->active();
    }

    /**
     * Get unassigned purchased plans (not yet assigned to a child).
     */
    public function unassignedPurchasedPlans(): HasMany
    {
        return $this->purchasedPlans()->unassigned()->active();
    }

    /**
     * Buy a plan for this parent.
     */
    public function buyPlan(Plan $plan): PurchasedPlan
    {
        return PurchasedPlan::create([
            'plan_id' => $plan->id,
            'user_id' => $this->id,
            'paid_price' => $plan->price,
            'purchased_at' => now(),
            'expires_at' => now()->addDays($plan->duration_days),
            'is_active' => true,
        ]);
    }

    /**
     * Assign a purchased plan to a child profile.
     */
    public function assignPlanToChild(PurchasedPlan $purchasedPlan, ChildProfile $child): void
    {
        $purchasedPlan->assignToChild($child);
    }

    /**
     * Get child profiles with active subscriptions.
     */
    public function childProfilesWithActiveSubscriptions(): HasMany
    {
        return $this->childProfiles()->whereHas('activePurchasedPlans');
    }

    public function isAdmin(): bool
    {
        return $this->role === RoleEnum::ADMIN;
    }

    public function isParent(): bool
    {
        return $this->role === RoleEnum::PARENT;
    }

    public function isTeacher(): bool
    {
        return $this->role === RoleEnum::TEACHER;
    }

    /**
     * Get the subjects this teacher teaches.
     */
    public function teacherSubjects(): BelongsToMany
    {
        return $this->belongsToMany(EducationalSubject::class, 'teacher_subject', 'user_id', 'educational_subject_id')
            ->withTimestamps();
    }

    /**
     * Get the unique education levels this teacher teaches (through subjects).
     */
    public function teacherLevels()
    {
        return $this->teacherSubjects()
            ->with('educationLevel')
            ->get()
            ->pluck('educationLevel')
            ->unique('id');
    }

    /**
     * Get the unique education level categories this teacher teaches (through subjects -> levels).
     */
    public function teacherCategories()
    {
        return $this->teacherSubjects()
            ->with('educationLevel.category')
            ->get()
            ->pluck('educationLevel.category')
            ->unique('id');
    }
}
