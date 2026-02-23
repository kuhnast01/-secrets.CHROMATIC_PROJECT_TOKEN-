-- CreateTable
CREATE TABLE "EnemyTemplate" (
    "id" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "ships" JSONB NOT NULL,
    "modifiers" JSONB NOT NULL,
    "anomaly" JSONB,
    "bossAbility" JSONB,

    CONSTRAINT "EnemyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemMetric" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service_name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "cpu_usage_pct" DOUBLE PRECISION,
    "memory_used_mb" INTEGER,
    "memory_total_mb" INTEGER,
    "load_avg_1m" DOUBLE PRECISION,
    "load_avg_5m" DOUBLE PRECISION,
    "load_avg_15m" DOUBLE PRECISION,
    "uptime_seconds" BIGINT,
    "request_rate_per_sec" DOUBLE PRECISION,
    "error_rate_per_sec" DOUBLE PRECISION,
    "avg_response_time_ms" DOUBLE PRECISION,
    "custom_tags" JSONB,
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "deployment_version" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "SystemMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestTrace" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trace_id" TEXT NOT NULL,
    "span_id" TEXT NOT NULL,
    "parent_span_id" TEXT,
    "service_name" TEXT NOT NULL,
    "route" TEXT,
    "method" TEXT,
    "status_code" INTEGER,
    "duration_ms" DOUBLE PRECISION,
    "user_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "request_body_snapshot" JSONB,
    "response_body_snapshot" JSONB,
    "error_flag" BOOLEAN,
    "error_message" TEXT,
    "is_anomaly" BOOLEAN DEFAULT false,
    "error_severity" TEXT,
    "correlation_id" TEXT,
    "session_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "deployment_version" TEXT,
    "feature_flag" TEXT,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "source_system" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,
    "meta" JSONB,

    CONSTRAINT "RequestTrace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service_name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "stack_trace" TEXT,
    "correlation_id" TEXT,
    "session_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "deployment_version" TEXT,
    "is_anomaly" BOOLEAN DEFAULT false,
    "error_severity" TEXT,
    "user_agent" TEXT,
    "device_type" TEXT,
    "geo_ip" TEXT,
    "feature_flag" TEXT,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "source_system" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "AppLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_type" TEXT NOT NULL,
    "actor_id" INTEGER,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "before_state" JSONB,
    "after_state" JSONB,
    "correlation_id" TEXT,
    "session_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "deployment_version" TEXT,
    "is_anomaly" BOOLEAN DEFAULT false,
    "error_severity" TEXT,
    "device_type" TEXT,
    "geo_ip" TEXT,
    "feature_flag" TEXT,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "source_system" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,
    "meta" JSONB,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveOpsEvent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "config" JSONB,
    "created_by_admin_id" INTEGER,
    "updated_by_admin_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "LiveOpsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveOpsEventMetric" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_users" INTEGER,
    "revenue" DOUBLE PRECISION,
    "engagement_score" DOUBLE PRECISION,
    "conversion_rate" DOUBLE PRECISION,
    "retention_delta" DOUBLE PRECISION,
    "meta" JSONB,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "LiveOpsEventMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_info" JSONB,
    "meta" JSONB,
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "session_id" TEXT,
    "event_type" TEXT NOT NULL,
    "event_name" TEXT,
    "properties" JSONB,
    "source" TEXT,
    "correlation_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "feature_flag" TEXT,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoseidonSession" (
    "id" SERIAL NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "initiator" TEXT,
    "purpose" TEXT,
    "meta" JSONB,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "PoseidonSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoseidonAction" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "input_context" JSONB,
    "output_summary" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "requires_human_approval" BOOLEAN,
    "approved_by_admin_id" INTEGER,
    "approved_at" TIMESTAMP(3),
    "meta" JSONB,
    "correlation_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "feature_flag" TEXT,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "PoseidonAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoseidonInsight" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT,
    "related_trace_id" TEXT,
    "related_event_id" INTEGER,
    "meta" JSONB,
    "status" TEXT,
    "resolved_by_admin_id" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "PoseidonInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "ip_address" TEXT,
    "protocol" TEXT,
    "status" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceHealthMetric" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "latency_ms" DOUBLE PRECISION,
    "frame_rate" DOUBLE PRECISION,
    "storage_used_pct" DOUBLE PRECISION,
    "temperature_c" DOUBLE PRECISION,
    "meta" JSONB,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "DeviceHealthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceEvent" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT NOT NULL,
    "severity" TEXT,
    "details" JSONB,
    "correlation_id" TEXT,
    "retention_policy" TEXT,
    "archived_at" TIMESTAMP(3),
    "environment" TEXT DEFAULT 'prod',
    "source_host" TEXT,
    "is_anomaly" BOOLEAN DEFAULT false,
    "error_severity" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "DeviceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updated_by_admin_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "target_segment" TEXT,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "experiment_id" TEXT,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_name_key" ON "FeatureFlag"("name");

-- AddForeignKey
ALTER TABLE "LiveOpsEventMetric" ADD CONSTRAINT "LiveOpsEventMetric_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "LiveOpsEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoseidonAction" ADD CONSTRAINT "PoseidonAction_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "PoseidonSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceHealthMetric" ADD CONSTRAINT "DeviceHealthMetric_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceEvent" ADD CONSTRAINT "DeviceEvent_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
