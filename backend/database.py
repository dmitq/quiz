import sqlalchemy
import sqlalchemy.ext.declarative as declarative
import sqlalchemy.orm as orm

DATABASE_URL = "sqlite:///./database.db"
engine = sqlalchemy.create_engine(DATABASE_URL,
                                  pool_size=20,
                                  connect_args={"check_same_thread": False})
SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative.declarative_base()
