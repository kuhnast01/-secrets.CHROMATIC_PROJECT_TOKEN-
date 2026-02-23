-- Poseidon Observability & Intelligence Schema
-- This schema is designed for full-stack, cross-domain, AI-ready observability and governance.

-- 1. Core system telemetry
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    service_name TEXT NOT NULL,
    host TEXT NOT NULL,
    cpu_usage_pct REAL,
    memory_used_mb INTEGER,
    memory_total_mb INTEGER,
    load_avg_1m REAL,
    load_avg_5m REAL,
    load_avg_15m REAL,
    uptime_seconds BIGINT,
    request_rate_per_sec REAL,
    error_rate_per_sec REAL,
    avg_response_time_ms REAL,
        custom_tags JSONB,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        deployment_version TEXT,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 2. Request/response tracing
CREATE TABLE request_traces (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    trace_id UUID NOT NULL,
    span_id UUID NOT NULL,
    parent_span_id UUID,
    service_name TEXT NOT NULL,
    route TEXT,
    method TEXT,
    status_code INTEGER,
    duration_ms REAL,
    user_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    request_body_snapshot JSONB,
    response_body_snapshot JSONB,
    error_flag BOOLEAN,
    error_message TEXT,
        -- Pillar 5: Error/Anomaly Flags
        is_anomaly BOOLEAN DEFAULT FALSE,
        error_severity TEXT,
        -- Pillar 1: Session/Correlation Tracking
        correlation_id UUID,
        session_id UUID,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        deployment_version TEXT,
        -- Pillar 7: Feature Flag/Experiment Tracking
        feature_flag TEXT,
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        source_system TEXT,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB,
        meta JSONB
);

-- 3. Application logs
CREATE TABLE app_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    service_name TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    stack_trace TEXT,
        correlation_id UUID,
        -- Pillar 1: Session/Correlation Tracking
        session_id UUID,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        deployment_version TEXT,
        -- Pillar 5: Error/Anomaly Flags
        is_anomaly BOOLEAN DEFAULT FALSE,
        error_severity TEXT,
        -- Pillar 6: User Agent/Device Metadata
        user_agent TEXT,
        device_type TEXT,
        geo_ip INET,
        -- Pillar 7: Feature Flag/Experiment Tracking
        feature_flag TEXT,
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        source_system TEXT,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 4. Audit & governance
CREATE TABLE audit_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    actor_type TEXT NOT NULL,
    actor_id INTEGER,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    before_state JSONB,
    after_state JSONB,
        -- Pillar 1: Session/Correlation Tracking
        correlation_id UUID,
        session_id UUID,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        deployment_version TEXT,
        -- Pillar 5: Error/Anomaly Flags
        is_anomaly BOOLEAN DEFAULT FALSE,
        error_severity TEXT,
        -- Pillar 6: User Agent/Device Metadata
        device_type TEXT,
        geo_ip INET,
        -- Pillar 7: Feature Flag/Experiment Tracking
        feature_flag TEXT,
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        source_system TEXT,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB,
        meta JSONB
);

-- 5. LiveOps & events intelligence
CREATE TABLE liveops_events (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    config JSONB,
    created_by_admin_id INTEGER,
    updated_by_admin_id INTEGER,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE liveops_event_metrics (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES liveops_events(id),
    timestamp TIMESTAMPTZ NOT NULL,
    active_users INTEGER,
    revenue NUMERIC,
    engagement_score REAL,
    conversion_rate REAL,
    retention_delta REAL,
    meta JSONB
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 6. User behavior & lifecycle
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id UUID NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    ip_address TEXT,
    user_agent TEXT,
    device_info JSONB,
    meta JSONB
        ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id INTEGER NOT NULL,
    session_id UUID,
    event_type TEXT NOT NULL,
    event_name TEXT,
    properties JSONB,
    source TEXT
        ,
        -- Pillar 1: Session/Correlation Tracking
        correlation_id UUID,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        -- Pillar 7: Feature Flag/Experiment Tracking
        feature_flag TEXT,
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 7. Poseidon’s own brain & actions
CREATE TABLE poseidon_sessions (
    id SERIAL PRIMARY KEY,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    initiator TEXT,
    purpose TEXT,
    meta JSONB
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE poseidon_actions (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    session_id INTEGER REFERENCES poseidon_sessions(id),
    action_type TEXT NOT NULL,
    input_context JSONB,
    output_summary TEXT,
    confidence_score REAL,
    requires_human_approval BOOLEAN,
    approved_by_admin_id INTEGER,
    approved_at TIMESTAMPTZ,
    meta JSONB
        ,
        -- Pillar 1: Session/Correlation Tracking
        correlation_id UUID,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        -- Pillar 7: Feature Flag/Experiment Tracking
        feature_flag TEXT,
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE poseidon_insights (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT,
    related_trace_id UUID,
    related_event_id INTEGER,
    meta JSONB,
    status TEXT,
    resolved_by_admin_id INTEGER,
    resolved_at TIMESTAMPTZ
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 8. Surveillance / device layer
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    ip_address TEXT,
    protocol TEXT,
    status TEXT,
    meta JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE device_health_metrics (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    timestamp TIMESTAMPTZ NOT NULL,
    status TEXT,
    latency_ms REAL,
    frame_rate REAL,
    storage_used_pct REAL,
    temperature_c REAL,
    meta JSONB
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE device_events (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    timestamp TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL,
    severity TEXT,
    details JSONB,
    correlation_id UUID
        ,
        -- Pillar 3: Retention/Archival Metadata
        retention_policy TEXT,
        archived_at TIMESTAMPTZ,
        -- Pillar 4: Source/Environment Metadata
        environment TEXT DEFAULT 'prod',
        source_host TEXT,
        -- Pillar 5: Error/Anomaly Flags
        is_anomaly BOOLEAN DEFAULT FALSE,
        error_severity TEXT,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

-- 9. Config & feature flags
CREATE TABLE system_configs (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by_admin_id INTEGER,
    updated_at TIMESTAMPTZ NOT NULL
        ,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    enabled BOOLEAN NOT NULL,
    target_segment TEXT,
    meta JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
        ,
        -- Pillar 7: Feature Flag/Experiment Tracking
        experiment_id UUID,
        -- Pillar 8: Data Provenance
        created_by INTEGER,
        updated_by INTEGER,
        -- Pillar 9: Soft Delete
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMPTZ,
        -- Pillar 10: Extensible JSONB
        metadata JSONB
);

    -- Pillar 2: Indexing and Partitioning (example indexes, tune as needed)
    CREATE INDEX idx_app_logs_timestamp ON app_logs (timestamp DESC);
    CREATE INDEX idx_app_logs_correlation_id ON app_logs (correlation_id);
    CREATE INDEX idx_app_logs_service_name ON app_logs (service_name);
    CREATE INDEX idx_request_traces_trace_id ON request_traces (trace_id);
    CREATE INDEX idx_request_traces_correlation_id ON request_traces (correlation_id);
    CREATE INDEX idx_audit_events_timestamp ON audit_events (timestamp DESC);
    CREATE INDEX idx_audit_events_correlation_id ON audit_events (correlation_id);
    CREATE INDEX idx_user_events_timestamp ON user_events (timestamp DESC);
    CREATE INDEX idx_user_events_correlation_id ON user_events (correlation_id);
    CREATE INDEX idx_device_events_timestamp ON device_events (timestamp DESC);
    CREATE INDEX idx_device_events_correlation_id ON device_events (correlation_id);
