import fs from 'node:fs/promises';
import path from 'node:path';
import express, { Request, Response } from 'express';
import request from 'supertest';
import { licenseGuard } from '../middleware/licenseGuard';
import { createLicenseKey, hashLicenseKey, normalizeLicenseKey } from '../security/license';
import { addRuntimeRevocation, listRuntimeRevocations, removeRuntimeRevocation } from '../security/licenseRevocations';

// ...rest of the original script logic, unchanged...
