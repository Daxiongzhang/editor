#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

apply_dependency_patch() {
  package_dir=$1
  patch_file=$2

  if git apply --check --directory="$package_dir" "$patch_file" 2>/dev/null; then
    git apply --directory="$package_dir" "$patch_file"
  elif ! git apply --reverse --check --directory="$package_dir" "$patch_file" 2>/dev/null; then
    echo "Cannot apply localization patch: $patch_file" >&2
    exit 1
  fi
}

apply_dependency_patch node_modules/@pascal-app/plugin-trees patches/plugin-trees@0.1.0.patch
apply_dependency_patch node_modules/@pascal-app/plugin-environment patches/plugin-environment@0.1.0.patch
apply_dependency_patch node_modules/@pascal-app/plugin-pool patches/plugin-pool@0.1.0.patch
apply_dependency_patch node_modules/@pascal-app/plugin-streetscape patches/plugin-streetscape@0.1.0.patch
apply_dependency_patch node_modules/@webxr/plugin patches/webxr-plugin@0.1.0.patch
