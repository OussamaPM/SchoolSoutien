<?php

use App\Models\Plan;
use App\Models\User;
use App\Models\ChildProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\PlanSeeder::class);
});

test('parent can buy plan', function () {
    // Arrange
    $parent = User::factory()->create();
    $plan = Plan::first();

    // Act
    $purchasedPlan = $parent->buyPlan($plan);

    // Assert
    expect($purchasedPlan->user_id)->toBe($parent->id);
    expect($purchasedPlan->plan_id)->toBe($plan->id);
    expect($purchasedPlan->paid_price)->toBe($plan->price);
    expect($purchasedPlan->child_profile_id)->toBeNull(); // Not assigned yet
    expect($purchasedPlan->isActive())->toBeTrue();
});

test('parent can create child profile', function () {
    // Arrange
    $parent = User::factory()->create();

    // Act
    $child = ChildProfile::create([
        'parent_id' => $parent->id,
        'name' => 'Emma',
        'birth_date' => '2015-05-15',
        'gender' => 'female',
        'is_active' => true,
    ]);

    // Assert
    expect($child->parent_id)->toBe($parent->id);
    expect($child->name)->toBe('Emma');
    expect($child->hasActiveSubscription())->toBeFalse(); // No plan assigned yet
});

test('parent can assign purchased plan to child', function () {
    // Arrange
    $parent = User::factory()->create();
    $plan = Plan::first();
    $child = ChildProfile::create([
        'parent_id' => $parent->id,
        'name' => 'Emma',
        'is_active' => true,
    ]);

    // Act
    $purchasedPlan = $parent->buyPlan($plan);
    $parent->assignPlanToChild($purchasedPlan, $child);

    // Assert
    expect($purchasedPlan->fresh()->child_profile_id)->toBe($child->id);
    expect($child->fresh()->hasActiveSubscription())->toBeTrue();
    expect($child->activePurchasedPlans()->first()->id)->toBe($purchasedPlan->id);
});

test('one plan per child business rule', function () {
    // Arrange
    $parent = User::factory()->create();
    $plan = Plan::first();

    $child1 = ChildProfile::create(['parent_id' => $parent->id, 'name' => 'Emma', 'is_active' => true]);
    $child2 = ChildProfile::create(['parent_id' => $parent->id, 'name' => 'Lucas', 'is_active' => true]);

    // Act - Buy separate plans for each child
    $purchasedPlan1 = $parent->buyPlan($plan);
    $purchasedPlan2 = $parent->buyPlan($plan);

    $parent->assignPlanToChild($purchasedPlan1, $child1);
    $parent->assignPlanToChild($purchasedPlan2, $child2);

    // Assert
    expect($child1->fresh()->hasActiveSubscription())->toBeTrue();
    expect($child2->fresh()->hasActiveSubscription())->toBeTrue();

    // Parent bought 2 separate plans
    expect($parent->purchasedPlans()->count())->toBe(2);

    // Each child has exactly one plan
    expect($child1->activePurchasedPlans()->count())->toBe(1);
    expect($child2->activePurchasedPlans()->count())->toBe(1);
});

test('child cannot access without plan', function () {
    // Arrange
    $parent = User::factory()->create();
    $child = ChildProfile::create([
        'parent_id' => $parent->id,
        'name' => 'Emma',
        'is_active' => true,
    ]);

    // Assert
    expect($child->hasActiveSubscription())->toBeFalse();
    expect($child->activePurchasedPlans()->count())->toBe(0);
});

test('parent can buy multiple plans for multiple children', function () {
    // Arrange
    $parent = User::factory()->create();
    $monthlyPlan = Plan::where('name', 'Plan Mensuel')->first();
    $yearlyPlan = Plan::where('name', 'Plan Annuel')->first();

    $child1 = ChildProfile::create(['parent_id' => $parent->id, 'name' => 'Emma', 'is_active' => true]);
    $child2 = ChildProfile::create(['parent_id' => $parent->id, 'name' => 'Lucas', 'is_active' => true]);
    $child3 = ChildProfile::create(['parent_id' => $parent->id, 'name' => 'Sophie', 'is_active' => true]);

    // Act
    $purchasedPlan1 = $parent->buyPlan($monthlyPlan);
    $purchasedPlan2 = $parent->buyPlan($monthlyPlan);
    $purchasedPlan3 = $parent->buyPlan($yearlyPlan);

    $parent->assignPlanToChild($purchasedPlan1, $child1);
    $parent->assignPlanToChild($purchasedPlan2, $child2);
    $parent->assignPlanToChild($purchasedPlan3, $child3);

    // Assert
    expect($parent->purchasedPlans()->count())->toBe(3);
    expect($child1->fresh()->hasActiveSubscription())->toBeTrue();
    expect($child2->fresh()->hasActiveSubscription())->toBeTrue();
    expect($child3->fresh()->hasActiveSubscription())->toBeTrue();

    // Total cost: 2 × monthly + 1 × yearly
    $totalCost = $parent->purchasedPlans()->sum('paid_price');
    $expectedCost = (2 * $monthlyPlan->price) + $yearlyPlan->price;
    expect($totalCost)->toBe($expectedCost);
});

test('purchased plan expires correctly', function () {
    // Arrange
    $parent = User::factory()->create();
    $plan = Plan::first();
    $child = ChildProfile::create([
        'parent_id' => $parent->id,
        'name' => 'Emma',
        'is_active' => true,
    ]);

    // Act
    $purchasedPlan = $parent->buyPlan($plan);
    $parent->assignPlanToChild($purchasedPlan, $child);

    // Simulate expiration by updating the expires_at field
    $purchasedPlan->update(['expires_at' => now()->subDay()]);

    // Assert
    expect($purchasedPlan->fresh()->isExpired())->toBeTrue();
    expect($purchasedPlan->fresh()->isActive())->toBeFalse();
    expect($child->fresh()->hasActiveSubscription())->toBeFalse();
});
