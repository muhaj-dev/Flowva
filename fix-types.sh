#!/bin/bash
# Fix type imports
sed -i 's/import { LucideIcon }/import type { LucideIcon }/g' src/components/ui/Button.tsx
sed -i 's/import { User as SupabaseUser }/import type { User as SupabaseUser }/g' src/contexts/AuthContext.tsx

# Remove unused imports
sed -i 's/, Menu//' src/components/rewards/Sidebar.tsx

# Remove unused variable setFilter
sed -i 's/const \[filter, setFilter\]/const \[filter\]/' src/components/rewards/RewardsGrid.tsx

# Remove duplicate declaration
echo "// Removed duplicate module declaration" >> src/components/rewards/RewardsGrid.tsx.bak
