"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canEdit = canEdit;
exports.canDelete = canDelete;
exports.canView = canView;
exports.canManageUsers = canManageUsers;
function canEdit(role) {
    return role === 'superadmin' || role === 'admin' || role === 'editor';
}
function canDelete(role) {
    return role === 'superadmin' || role === 'admin';
}
function canView(role) {
    return true;
}
function canManageUsers(role) {
    return role === 'superadmin';
}
