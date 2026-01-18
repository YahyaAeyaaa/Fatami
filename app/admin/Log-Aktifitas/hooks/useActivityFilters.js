/**
 * useActivityFilters Hook (for Admin Log Aktifitas)
 * Custom hook untuk filtering activities
 */

import { useMemo } from 'react'

export function useActivityFilters(activities, searchQuery, activityFilter) {
  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesType = activityFilter === 'ALL' || activityFilter === activity.type

      const matchesSearch =
        !searchQuery ||
        activity.target?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.target?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.title?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesType && matchesSearch
    })
  }, [activities, searchQuery, activityFilter])

  // Stats
  const stats = useMemo(() => {
    return {
      total: activities.length,
      equipments: activities.filter((a) => a.type.startsWith('EQUIPMENT')).length,
      categories: activities.filter((a) => a.type.startsWith('CATEGORY')).length,
      users: activities.filter((a) => a.type.startsWith('USER')).length,
    }
  }, [activities])

  return {
    filteredActivities,
    stats,
  }
}

