<?php

namespace App;

interface DashboardInterface
{
    public function getParentData(): array;

    public function getTeacherData(): array;

    public function getAdminData(): array;
}
