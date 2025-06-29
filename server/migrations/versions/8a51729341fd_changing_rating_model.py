"""Changing rating model

Revision ID: 8a51729341fd
Revises: be884714ff04
Create Date: 2025-06-28 19:40:06.482255

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a51729341fd'
down_revision = 'be884714ff04'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('ratings') as batch_op:
        # Step 1: Add new column as nullable
        batch_op.add_column(sa.Column('tmdb_movie_id', sa.Integer(), nullable=True))

    # Step 2: Migrate data if needed (optional depending on data)
    # Example: set tmdb_movie_id = 0 for all existing records (or pull from favorite_id if mapping exists)
    op.execute('UPDATE ratings SET tmdb_movie_id = 0 WHERE tmdb_movie_id IS NULL')

    with op.batch_alter_table('ratings') as batch_op:
        # Step 3: Alter column to NOT NULL
        batch_op.alter_column('tmdb_movie_id', nullable=False)
        # Step 4: Drop the old column
        batch_op.drop_column('favorite_id')


def downgrade():
    with op.batch_alter_table('ratings') as batch_op:
        batch_op.add_column(sa.Column('favorite_id', sa.Integer(), nullable=True))
        batch_op.drop_column('tmdb_movie_id')
    # ### end Alembic commands ###
