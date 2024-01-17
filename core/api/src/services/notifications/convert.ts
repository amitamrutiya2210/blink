import {
  UserNotificationSettings as GrpcNotificationSettings,
  NotificationCategory as GrpcNotificationCategory,
  NotificationChannel as GrpcNotificationChannel,
} from "./proto/notifications_pb"

import {
  GaloyNotificationCategories,
  InvalidPushNotificationSettingError,
  NotificationChannel,
} from "@/domain/notifications"

export const grpcNotificationSettingsToNotificationSettings = (
  settings: GrpcNotificationSettings | undefined,
): NotificationSettings | InvalidPushNotificationSettingError => {
  if (!settings) return new InvalidPushNotificationSettingError("No settings provided")

  const pushSettings = settings.getPush()
  if (!pushSettings)
    return new InvalidPushNotificationSettingError("No push settings provided")

  const disabledCategories = pushSettings
    .getDisabledCategoriesList()
    .map(grpcNotificationCategoryToNotificationCategory)
    .filter(
      (category): category is NotificationCategory =>
        !(category instanceof InvalidPushNotificationSettingError),
    )

  const notificationSettings: NotificationSettings = {
    push: {
      enabled: pushSettings.getEnabled(),
      disabledCategories,
    },
  }

  return notificationSettings
}

export const grpcNotificationCategoryToNotificationCategory = (
  category: GrpcNotificationCategory,
): NotificationCategory | InvalidPushNotificationSettingError => {
  switch (category) {
    case GrpcNotificationCategory.PAYMENTS:
      return GaloyNotificationCategories.Payments
    case GrpcNotificationCategory.CIRCLES:
      return "Circles" as NotificationCategory
    default:
      return new InvalidPushNotificationSettingError(
        `Invalid notification category: ${category}`,
      )
  }
}

// TODO: Add support for AdminPushNotification and Balance to Notifications pod
export const notificationCategoryToGrpcNotificationCategory = (
  category: NotificationCategory,
): GrpcNotificationCategory => {
  switch (category) {
    case GaloyNotificationCategories.Payments:
      return GrpcNotificationCategory.PAYMENTS
    case "Circles":
      return GrpcNotificationCategory.CIRCLES
    case GaloyNotificationCategories.AdminPushNotification:
    case GaloyNotificationCategories.Balance:
    default:
      throw new Error(`Not implemented: ${category}`)
  }
}

export const notificationChannelToGrpcNotificationChannel = (
  channel: NotificationChannel,
): GrpcNotificationChannel => {
  switch (channel) {
    case NotificationChannel.Push:
      return GrpcNotificationChannel.PUSH
  }
}