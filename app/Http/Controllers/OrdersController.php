<?php

namespace App\Http\Controllers;

use App\Models\PurchasedPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrdersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return Inertia::render('admin/orders/index', [
            'purchasedPlans' => fn () => PurchasedPlan::with(['plan', 'user', 'childProfile'])
                ->latest()
                ->get(),
        ]);
    }
}
