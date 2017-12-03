# DB Notes

## Tables

### `deleted`
Rather than screwing around with checking if `deleted_at` is null, I opted to archive deleted objects in a table with three columns: `deleted_at`, `original_table`, and `row_data` (a `jsonb` field). Deleted rows from tables that have had it enabled on will automatically be sent to this table. In the event of a mistake, data should be able to be restored from here without resorting to digging through backups (that may be gone). Obviously, fast-moving data should not be archived here - we can't have terrabytes dedicated to deleted storage. A cron job should perhaps be set up to regularly hard delete things older than a month or two.

### `raw_*`
These are un-optimized data store. When new data is imported, it's put in these tables and they act as the basis for refreshing the DB's data structures.

### `*_rel`
These are many-to-many relationships

### `groups`
This provides the backbone for the data structure. A group is of a type, typically `HSP` or `DMA`, etc. However, non-group db objects cannot be associated with groups in `groups_rel`. As a result, there are also `Tech` groups (which have size 1 - a single tech) and `Manager` groups (the similar for managers). Groups should always be upserted, persisting their `id` and other characteristsics and should only be deleted in the event that the underlying object is, itself deleted.